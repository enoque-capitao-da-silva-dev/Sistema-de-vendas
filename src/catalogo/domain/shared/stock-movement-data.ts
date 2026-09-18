import { StockMovementOrigin } from "../enums/stock-movement-origin.enum";

export interface StockMovementData {
  id: string;
  quantidade: number;
  origem: StockMovementOrigin;
  referenciaId?: string | null;
  motivo?: string | null;
  createdAt: Date;
}