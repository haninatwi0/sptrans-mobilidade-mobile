import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, RADIUS } from '../theme';
import { APP_NAME, APP_DESCRIPTION } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>SPTRANS</Text>
        <Text style={styles.title}>Sua mobilidade,</Text>
        <Text style={styles.titleHighlight}>mais simples.</Text>

        <Text style={styles.description}>
          {APP_DESCRIPTION}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>
          Bem-vindo ao {APP_NAME}
        </Text>

        <Text style={styles.sectionDescription}>
          Encontre informações sobre o transporte público de São Paulo.
        </Text>

<Pressable
  style={({ pressed }) => [
    styles.primaryCard,
    hoveredCard === 'lines' && styles.cardHovered,
    pressed && styles.cardPressed,
  ]}
  onHoverIn={() => setHoveredCard('lines')}
  onHoverOut={() => setHoveredCard(null)}
  onPress={() => navigation.navigate('BusLines')}
>
  <Text style={styles.cardIcon}>🚌</Text>

  <View style={styles.cardTextContainer}>
    <Text style={styles.primaryCardTitle}>
      Consultar linhas
    </Text>

    <Text style={styles.primaryCardDescription}>
      Pesquise linhas e seus destinos.
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</Pressable>

        <View style={styles.secondaryCards}>
          <Pressable
  style={({ pressed }) => [
    styles.secondaryCard,
    hoveredCard === 'favorites' && styles.cardHovered,
    pressed && styles.cardPressed,
  ]}
  onHoverIn={() => setHoveredCard('favorites')}
  onHoverOut={() => setHoveredCard(null)}
  onPress={() => navigation.navigate('Favorites')}
>
  <Text style={styles.secondaryIcon}>★</Text>

  <Text style={styles.secondaryTitle}>
    Favoritos
  </Text>

  <Text style={styles.secondaryDescription}>
    Suas linhas salvas.
  </Text>
</Pressable>
         <Pressable
  style={({ pressed }) => [
    styles.secondaryCard,
    hoveredCard === 'settings' && styles.cardHovered,
    pressed && styles.cardPressed,
  ]}
  onHoverIn={() => setHoveredCard('settings')}
  onHoverOut={() => setHoveredCard(null)}
  onPress={() => navigation.navigate('Settings')}
>
  <Text style={styles.secondaryIcon}>⚙</Text>

  <Text style={styles.secondaryTitle}>
    Configurações
  </Text>

  <Text style={styles.secondaryDescription}>
    Preferências do aplicativo.
  </Text>
</Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Informação de transporte
          </Text>

          <Text style={styles.infoDescription}>
            Os dados das linhas serão consultados diretamente
            na API Olho Vivo da SPTrans.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        SPTrans Mobile · São Paulo, Brasil
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: 55,
    paddingBottom: 45,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  brand: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 28,
  },

  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },

  titleHighlight: {
    color: COLORS.secondary,
    fontSize: 32,
    fontWeight: 'bold',
  },

  description: {
    color: '#D7E4EF',
    fontSize: 15,
    marginTop: 14,
    lineHeight: 23,
  },

  content: {
    padding: SPACING.md,
  },

  welcome: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
  },

  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 21,
  },

  primaryCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },

  cardIcon: {
    fontSize: 32,
  },

  cardTextContainer: {
    flex: 1,
  },

  primaryCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  primaryCardDescription: {
    color: COLORS.textSecondary,
    marginTop: 5,
    fontSize: 13,
  },

  arrow: {
    fontSize: 30,
    color: COLORS.primary,
  },

  secondaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },

  secondaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  secondaryIcon: {
    fontSize: 25,
    color: COLORS.secondary,
    marginBottom: 12,
  },

  secondaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  secondaryDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: 22,
  },

  infoTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },

  infoDescription: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },

  footer: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    padding: 25,
  },

  cardHovered: {
  backgroundColor: COLORS.primaryLight,
  borderColor: COLORS.primary,
},

cardPressed: {
  transform: [{ scale: 0.97 }],
  opacity: 0.85,
},
});