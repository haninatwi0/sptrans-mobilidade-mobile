import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants';
import { FavoriteLine } from '../types';

function isFavoriteLine(value: unknown): value is FavoriteLine {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.lineId === 'number' &&
    typeof item.lineCode === 'string' &&
    typeof item.destination === 'string' &&
    typeof item.direction === 'string'
  );
}

export async function getFavorites(): Promise<FavoriteLine[]> {
  try {
    const storedData = await AsyncStorage.getItem(
      STORAGE_KEYS.FAVORITES
    );

    if (!storedData) {
      return [];
    }

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.filter(isFavoriteLine);
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

export async function saveFavorite(
  line: FavoriteLine
): Promise<void> {
  try {
    const favorites = await getFavorites();

    const alreadyExists = favorites.some(
      (item) => item.lineId === line.lineId
    );

    if (alreadyExists) {
      return;
    }

    const updatedFavorites = [...favorites, line];

    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
}

export async function removeFavorite(
  lineId: number
): Promise<void> {
  try {
    const favorites = await getFavorites();

    const updatedFavorites = favorites.filter(
      (item) => item.lineId !== lineId
    );

    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

export async function clearFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
}