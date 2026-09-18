import { StockMovementPage } from '../outputs/stock-movement-page';
import { StockMovementQuery } from '../outputs/stock-movement-query';

/*
export interface StockMovementReader {
  findByStock(
    estoqueId: string,
    options: {
      page: number;
      limit: number;
    },
  ): Promise<StockMovementPage>;
}
*/

export interface StockMovementReader {
  findByStockId(
    stockId: string,
    query: StockMovementQuery,
  ): Promise<StockMovementPage>;
}
