import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import BusLinesScreen from '../screens/BusLinesScreen';
import BusDetailsScreen from '../screens/BusDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { COLORS } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BusLines"
        component={BusLinesScreen}
        options={{ title: 'Linhas de ônibus' }}
      />

      <Stack.Screen
        name="BusDetails"
        component={BusDetailsScreen}
        options={{ title: 'Detalhes da linha' }}
      />

      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Linhas favoritas' }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
    </Stack.Navigator>
  );
}