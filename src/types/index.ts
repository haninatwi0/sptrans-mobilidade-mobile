export interface FavoriteLine {
  lineId: number;
  lineCode: string;
  destination: string;
  direction: string;
}

export interface BusLine {
  codigo: number;
  circular: boolean;
  letreiro: string;
  sentido: number;
  tipo: number;
  denomLinha: string;
  denomSentidoOrigem: string;
  denomSentidoDestino: string;
}