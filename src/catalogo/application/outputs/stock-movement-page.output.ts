import { StockMovementOutput } from "./stock-movement.output";

export interface StockMovementPageOutput {
  items: StockMovementOutput[];
  page: number;
  limit: number;
  total: number;
}