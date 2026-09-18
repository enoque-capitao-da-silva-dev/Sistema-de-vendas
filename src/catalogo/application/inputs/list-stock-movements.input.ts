import { StockMovementOrigin } from "../../domain/enums/stock-movement-origin.enum";
import { StockMovementType } from "../../domain/enums/stock-movement-type.enum";

export interface ListStockMovementsInput {
  productId: string;
  page: number;
  limit: number;
  tipo?: StockMovementType;
  origem?: StockMovementOrigin;
  from?: Date;
  to?: Date;
}