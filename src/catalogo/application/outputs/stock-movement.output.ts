import { StockMovementType } from "../../domain/enums/stock-movement-type.enum";
import { StockMovementOrigin } from "../../domain/enums/stock-movement-origin.enum";

export interface StockMovementOutput {
  id: string;
  estoqueId: string;
  tipo: StockMovementType;
  origem: StockMovementOrigin;
  quantidade: number;
  quantidadeAnterior: number;
  quantidadePosterior: number;
  referenciaId: string | null;
  motivo: string | null;
  createdAt: Date;
}