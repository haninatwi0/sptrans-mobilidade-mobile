const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();
const PORT = 3000;

const SPTRANS_API =
  'https://api.olhovivo.sptrans.com.br/v2.1';

app.use(cors());
app.use(express.json());

// Authenticate with SPTrans and retrieve the session cookie.
async function authenticateSPTrans() {
  const token = process.env.SPTRANS_TOKEN;

  if (!token) {
    throw new Error('SPTRANS_TOKEN is not configured.');
  }

  const response = await fetch(
    `${SPTRANS_API}/Login/Autenticar?token=${encodeURIComponent(token)}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error('SPTrans authentication request failed.');
  }

  const authenticated = await response.json();

  if (authenticated !== true) {
    throw new Error('SPTrans rejected the token.');
  }

  const cookies = response.headers.getSetCookie();

  if (!cookies || cookies.length === 0) {
    throw new Error('SPTrans did not return a session cookie.');
  }

  return cookies
    .map(cookie => cookie.split(';')[0])
    .join('; ');
}

// Backend health check.
app.get('/', (req, res) => {
  res.json({
    message: 'SPTrans backend is running.',
  });
});

// Authentication test.
app.post('/api/sptrans/auth-test', async (req, res) => {
  try {
    await authenticateSPTrans();

    res.json({
      success: true,
      message: 'SPTrans authentication successful.',
    });
  } catch (error) {
    console.error('Authentication error:', error.message);

    res.status(502).json({
      success: false,
      message: 'SPTrans authentication failed.',
    });
  }
});

// Search real bus lines.
app.get('/api/lines', async (req, res) => {
  const search = req.query.search?.trim();

  if (!search || search.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Enter at least two characters to search.',
    });
  }

  if (search.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Search term is too long.',
    });
  }

  try {
    const cookie = await authenticateSPTrans();

    const url = new URL(`${SPTRANS_API}/Linha/Buscar`);
    url.searchParams.set('termosBusca', search);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: cookie,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `SPTrans line search failed: HTTP ${response.status}`
      );
    }

    const lines = await response.json();

    res.json({
      success: true,
      total: Array.isArray(lines) ? lines.length : 0,
      data: lines,
    });
  } catch (error) {
    console.error('Line search error:', error.message);

    res.status(502).json({
      success: false,
      message: 'Could not retrieve bus lines from SPTrans.',
    });
  }
});

// Retrieve stops and live vehicle positions for a bus line.
app.get('/api/lines/:lineId/details', async (req, res) => {
  const lineId = Number(req.params.lineId);

  if (!Number.isInteger(lineId) || lineId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid bus line ID.',
    });
  }

  try {
    const cookie = await authenticateSPTrans();

    const headers = {
      Cookie: cookie,
      Accept: 'application/json',
    };

    const stopsUrl = new URL(
      `${SPTRANS_API}/Parada/BuscarParadasPorLinha`
    );
    stopsUrl.searchParams.set('codigoLinha', lineId);

    const vehiclesUrl = new URL(
      `${SPTRANS_API}/Posicao/Linha`
    );
    vehiclesUrl.searchParams.set('codigoLinha', lineId);

    const [stopsResponse, vehiclesResponse] = await Promise.all([
      fetch(stopsUrl, { headers }),
      fetch(vehiclesUrl, { headers }),
    ]);

    if (!stopsResponse.ok || !vehiclesResponse.ok) {
      throw new Error('SPTrans details request failed.');
    }

    const [stops, vehicles] = await Promise.all([
      stopsResponse.json(),
      vehiclesResponse.json(),
    ]);

    res.json({
      success: true,
      lineId,
      totalStops: Array.isArray(stops) ? stops.length : 0,
      stops: Array.isArray(stops) ? stops : [],
      vehicles: vehicles || { hr: null, vs: [] },
    });
  } catch (error) {
    console.error('Line details error:', error.message);

    res.status(502).json({
      success: false,
      message: 'Could not retrieve bus line details from SPTrans.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
