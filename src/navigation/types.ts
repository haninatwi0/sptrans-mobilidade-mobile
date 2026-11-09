export type RootStackParamList = {
  Home: undefined;
  BusLines: undefined;
  BusDetails: {
    lineId: number;
    lineCode: string;
    destination: string;
    direction: string;
  };
  Favorites: undefined;
  Settings: undefined;
};