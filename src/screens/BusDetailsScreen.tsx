import { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { saveFavorite } from '../storage/storage';
import { COLORS, SPACING, RADIUS } from '../theme';
import Button from '../components/Button';

const API_URL = 'http://localhost:3000';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BusDetails'
>;

interface BusStop {
  cp: number;
  np: string;
  ed: string;
  py: number;
  px: number;
}

interface BusVehicle {
  p: string;
  a: boolean;
  ta: string;
  py: number;
  px: number;
  sv?: number | null;
  is?: number | null;
}

interface LineDetails {
  success: boolean;
  lineId: number;
  totalStops: number;
  stops: BusStop[];
  vehicles: {
    hr: string | null;
    vs: BusVehicle[];
  };
}

export default function BusDetailsScreen({ route }: Props) {
  const { lineId, lineCode, destination, direction } = route.params;

  const [details, setDetails] = useState<LineDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(
        `${API_URL}/api/lines/${lineId}/details`
      );

      const result: LineDetails = await response.json();

      if (!response.ok || !result.success) {
        throw new Error('Não foi possível consultar os detalhes.');
      }

      setDetails(result);
    } catch (err) {
      console.error('Bus details error:', err);

      setError(
        'Não foi possível carregar as informações da linha. Verifique sua conexão com o servidor.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lineId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchDetails();
  }

async function handleFavorite() {
  try {
    await saveFavorite({
      lineId,
      lineCode,
      destination,
      direction,
    });

    Alert.alert(
      'Favorito salvo',
      'A linha foi adicionada aos seus favoritos.'
    );
  } catch {
    Alert.alert(
      'Erro',
      'Não foi possível salvar esta linha.'
    );
  }
}

  function formatUpdateTime(timestamp: string) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return 'Horário indisponível';
    }

    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <Text style={styles.label}>LINHA DE ÔNIBUS</Text>

        <Text style={styles.lineCode}>{lineCode}</Text>

        <Text style={styles.destination}>{destination}</Text>

        <Text style={styles.direction}>{direction}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Informações da linha
        </Text>

{loading || (refreshing && !details) ? (
            <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
            <Text style={styles.secondaryText}>
              Consultando dados da SPTrans...
            </Text>
          </View>
        ) : error ? (
          <View>
            <Text style={styles.error}>{error}</Text>

          <Button
  title="Tentar novamente"
  variant="outline"
  onPress={handleRefresh}
/>
          </View>
        ) : details ? (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {details.totalStops}
                </Text>
                <Text style={styles.statLabel}>
                  Pontos de parada
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {details.vehicles?.vs?.length ?? 0}
                </Text>
                <Text style={styles.statLabel}>
                  Veículos localizados
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Veículos em tempo real
              </Text>

              <Button
  title={refreshing ? 'Atualizando...' : '↻ Atualizar'}
  variant="outline"
  onPress={handleRefresh}
  disabled={refreshing}
/>
            </View>

            <Text style={styles.secondaryText}>
              Última atualização da consulta:{' '}
              {details.vehicles?.hr || 'Indisponível'}
            </Text>

            {details.vehicles?.vs?.length ? (
              details.vehicles.vs.map((vehicle) => (
                <View
                  key={vehicle.p}
                  style={styles.vehicleCard}
                >
                  <View style={styles.vehicleHeader}>
                    <Text style={styles.vehicleNumber}>
                      Ônibus {vehicle.p}
                    </Text>

                    <Text
                      style={[
                        styles.accessibility,
                        vehicle.a
                          ? styles.accessible
                          : styles.notAccessible,
                      ]}
                    >
                      {vehicle.a
                        ? 'Acessível'
                        : 'Não acessível'}
                    </Text>
                  </View>

                  <Text style={styles.vehicleDetail}>
                    Latitude: {vehicle.py.toFixed(5)}
                  </Text>

                  <Text style={styles.vehicleDetail}>
                    Longitude: {vehicle.px.toFixed(5)}
                  </Text>

                  <Text style={styles.vehicleDetail}>
                    Posição atualizada às:{' '}
                    {formatUpdateTime(vehicle.ta)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                Nenhum veículo está transmitindo sua posição
                neste momento.
              </Text>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Pontos de parada
              </Text>
            </View>

            <Text style={styles.secondaryText}>
              {details.totalStops} pontos encontrados na API SPTrans.
            </Text>

            {details.stops.map((stop, index) => (
              <View
                key={stop.cp}
                style={styles.stopCard}
              >
                <View style={styles.stopNumber}>
                  <Text style={styles.stopNumberText}>
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>
                    {stop.np}
                  </Text>

                  <Text style={styles.stopAddress}>
                    {stop.ed}
                  </Text>

                  <Text style={styles.stopCoordinates}>
                    {stop.py.toFixed(5)}, {stop.px.toFixed(5)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : null}

      <Button
  title="★ Adicionar aos favoritos"
  onPress={handleFavorite}
/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: SPACING.lg,
    paddingBottom: 35,
  },

  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  lineCode: {
    fontSize: 35,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 15,
  },

  destination: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 8,
  },

  direction: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 25,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },

  loadingContainer: {
    alignItems: 'center',
    padding: 25,
  },

  secondaryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },

  error: {
    color: '#C62828',
    fontSize: 14,
    lineHeight: 21,
  },

  refreshButton: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: RADIUS.md,
    marginTop: 12,
    alignItems: 'center',
  },

  refreshButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },

  refreshText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },

  vehicleCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
  },

  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },

  vehicleNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  accessibility: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },

  accessible: {
    backgroundColor: '#E1F3E8',
    color: '#247A45',
  },

  notAccessible: {
    backgroundColor: '#FCE8E6',
    color: '#B3261E',
  },

  vehicleDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 12,
  },

  stopCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  stopNumber: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stopNumberText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },

  stopInfo: {
    flex: 1,
  },

  stopName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  stopAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
    lineHeight: 18,
  },

  stopCoordinates: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
});