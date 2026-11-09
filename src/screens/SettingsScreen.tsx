import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import { clearFavorites } from '../storage/storage';
import { COLORS, SPACING, RADIUS } from '../theme';
import { APP_NAME } from '../constants';
import Button from '../components/Button';

export default function SettingsScreen() {
  async function performClearFavorites() {
  try {
    await clearFavorites();

    if (Platform.OS === 'web') {
      window.alert('Todas as linhas favoritas foram removidas.');
    } else {
      Alert.alert(
        'Sucesso',
        'Todas as linhas favoritas foram removidas.',
      );
    }
  } catch {
    if (Platform.OS === 'web') {
      window.alert('Não foi possível limpar os favoritos.');
    } else {
      Alert.alert(
        'Erro',
        'Não foi possível limpar os favoritos.',
      );
    }
  }
}

function handleClearFavorites() {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(
      'Tem certeza de que deseja remover todas as linhas favoritas?',
    );

    if (confirmed) {
      void performClearFavorites();
    }

    return;
  }

  Alert.alert(
    'Limpar favoritos',
    'Tem certeza de que deseja remover todas as linhas favoritas?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: () => {
          void performClearFavorites();
        },
      },
    ],
  );
}

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Sobre o aplicativo
        </Text>

        <Text style={styles.appName}>
          {APP_NAME}
        </Text>

        <Text style={styles.description}>
          Aplicativo de mobilidade urbana desenvolvido
          para facilitar o acesso às informações do
          transporte público por ônibus em São Paulo.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Armazenamento local
        </Text>

        <Text style={styles.description}>
          Suas linhas favoritas são armazenadas localmente
          no dispositivo utilizando AsyncStorage.
        </Text>

        <Button
          title="Limpar linhas favoritas"
          variant="danger"
          onPress={handleClearFavorites}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {APP_NAME}
        </Text>

        <Text style={styles.version}>
          Versão 1.0.0
        </Text>

        <Text style={styles.version}>
          FIAP · 2026
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },

  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },

  sectionTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 15,
  },

  appName: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 19,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  footer: {
    alignItems: 'center',
    marginTop: 25,
  },

  footerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
