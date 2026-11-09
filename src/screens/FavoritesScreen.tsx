import { useCallback, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { getFavorites, removeFavorite } from '../storage/storage';
import type { FavoriteLine } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme';
import Button from '../components/Button';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Favorites'
>;

export default function FavoritesScreen({ navigation }: Props) {
  const [favorites, setFavorites] = useState<FavoriteLine[]>([]);

  const loadFavorites = useCallback(async () => {
    const data = await getFavorites();
    setFavorites(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  async function handleRemove(lineId: number) {
    await removeFavorite(lineId);
    await loadFavorites();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Suas linhas favoritas
      </Text>

      <Text style={styles.description}>
        Acesse rapidamente as linhas que você salvou.
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.lineId)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>★</Text>

            <Text style={styles.emptyTitle}>
              Nenhuma linha salva
            </Text>

            <Text style={styles.emptyDescription}>
              Suas linhas favoritas aparecerão aqui.
            </Text>

            <Button
  title="Consultar linhas"
  onPress={() => navigation.navigate('BusLines')}
/>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.favoriteCard}>
          <Pressable
              style={({ pressed }) => [
                styles.favoriteInfo,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate('BusDetails', {
                  lineId: item.lineId,
                  lineCode: item.lineCode,
                  destination: item.destination,
                  direction: item.direction,
                })
              }
              >
              <Text style={styles.lineCode}>
                {item.lineCode}
              </Text>

              <Text style={styles.destination}>
                {item.destination}
              </Text>

              <Text style={styles.direction}>
                {item.direction}
              </Text>
            </Pressable>

            <Button
  title="Remover"
  variant="outline"
  onPress={() => handleRemove(item.lineId)}
/>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },

  list: {
    paddingTop: 22,
    flexGrow: 1,
  },

  favoriteCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  favoriteInfo: {
    flex: 1,
  },

  lineCode: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 19,
  },

  destination: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },

  direction: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  emptyIcon: {
    color: COLORS.secondary,
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
  },

  emptyDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },

  cardPressed: {
  opacity: 0.65,
  transform: [{ scale: 0.98 }],
},
});