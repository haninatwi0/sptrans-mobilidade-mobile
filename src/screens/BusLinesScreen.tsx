import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, SPACING, RADIUS } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import Button from '../components/Button';

const API_URL = 'http://localhost:3000';

interface BusLine {
  cl: number;
  lc: boolean;
  lt: string;
  sl: number;
  tl: number;
  tp: string;
  ts: string;
}

interface SearchResponse {
  success: boolean;
  total: number;
  data: BusLine[];
}

type NavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

export default function BusLinesScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [search, setSearch] = useState('');
  const [lines, setLines] = useState<BusLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  async function searchLines() {
    const term = search.trim();

    if (term.length < 2) {
      setError('Digite pelo menos dois caracteres.');
      setLines([]);
      setSearched(false);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setSearched(true);
    setLines([]);

    try {
      const response = await fetch(
        `${API_URL}/api/lines?search=${encodeURIComponent(term)}`
      );

      const result: SearchResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error('Não foi possível consultar as linhas.');
      }

      setLines(result.data);
    } catch (err) {
      console.error('Bus line search error:', err);

      setError(
        'Não foi possível conectar ao servidor. Verifique se o backend está funcionando.'
      );
    } finally {
      setLoading(false);
    }
  }

function openLine(line: BusLine) {
  navigation.navigate('BusDetails', {
    lineId: line.cl,
    lineCode: line.lt,
    destination: `${line.tp} / ${line.ts}`,
    direction: `Sentido ${line.sl}`,
  });
}

function renderLine({ item }: { item: BusLine }) {
  return (
    <Pressable
      style={[
        styles.lineCard,
        hoveredLine === item.cl && {
          backgroundColor: COLORS.primaryLight,
        },
      ]}
      onHoverIn={() => setHoveredLine(item.cl)}
      onHoverOut={() => setHoveredLine(null)}
      onPress={() => openLine(item)}
    >
      <View style={styles.lineHeader}>
        <View style={styles.lineNumberContainer}>
          <Text style={styles.lineNumber}>
            {item.lt}
          </Text>
        </View>

        <View style={styles.lineInfo}>
          <Text style={styles.destination}>
            {item.tp}
          </Text>

          <Text style={styles.origin}>
            Origem: {item.ts}
          </Text>

          <Text style={styles.direction}>
            Sentido {item.sl}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Encontre sua linha
      </Text>

      <Text style={styles.description}>
        Pesquise pelo número ou identificação da linha de ônibus.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex.: 8000 ou Lapa"
        placeholderTextColor={COLORS.textSecondary}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="characters"
        returnKeyType="search"
        onSubmitEditing={searchLines}
      />

    <Button
  title="Buscar linhas"
  onPress={searchLines}
  loading={loading}
  disabled={loading}
/>

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      {loading ? (
        <View style={styles.messageContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={styles.message}>
            Consultando linhas na SPTrans...
          </Text>
        </View>
      ) : searched && lines.length === 0 && !error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.emptyIcon}>🚌</Text>

          <Text style={styles.emptyTitle}>
            Nenhuma linha encontrada
          </Text>

          <Text style={styles.message}>
            Tente pesquisar com outro número ou destino.
          </Text>
        </View>
      ) : lines.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {lines.length} linhas encontradas
          </Text>

          <FlatList
            data={lines}
            keyExtractor={(item) => String(item.cl)}
            renderItem={renderLine}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      ) : !searched ? (
        <View style={styles.messageContainer}>
          <Text style={styles.emptyIcon}>🚌</Text>

          <Text style={styles.emptyTitle}>
            Consulte uma linha de ônibus
          </Text>

          <Text style={styles.message}>
            Pesquise para visualizar os resultados oficiais da SPTrans.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 10,
    lineHeight: 21,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 16,
    fontSize: 15,
    marginTop: 25,
    color: COLORS.text,
  },

  error: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 12,
  },

  resultsContainer: {
    flex: 1,
    marginTop: 28,
  },

  resultsTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  listContent: {
    paddingBottom: 25,
  },

  lineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  lineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  lineNumberContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: 12,
    minWidth: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lineNumber: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  lineInfo: {
    flex: 1,
    marginLeft: 14,
  },

  destination: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },

  origin: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  direction: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },

  arrow: {
    color: COLORS.textSecondary,
    fontSize: 27,
    marginLeft: 8,
  },

  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 65,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 18,
  },

  emptyTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },

  message: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
  },
});