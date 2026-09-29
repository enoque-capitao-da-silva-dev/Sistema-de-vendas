import { StockMovementPage } from '../outputs/stock-movement-page';
import { StockMovementQuery } from '../outputs/stock-movement-query';

export interface StockMovementReader {
  findByStockId(
    stockId: string,
    query: StockMovementQuery,
  ): Promise<StockMovementPage>;

  findBySaleId(saleId: string): Promise<StockMovementPage>;
}

export const STOCK_MOVEMENT_READER = Symbol('STOCK_MOVEMENT_READER');