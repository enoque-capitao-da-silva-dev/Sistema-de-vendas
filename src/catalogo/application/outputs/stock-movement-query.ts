import { StockMovementType } from "../../domain/enums/stock-movement-type.enum";
import { StockMovementOrigin } from "../../domain/enums/stock-movement-origin.enum";

export interface StockMovementQuery {
  page: number;
  limit: number;
  tipo?: StockMovementType;
  origem?: StockMovementOrigin;
  from?: Date;
  to?: Date;
}