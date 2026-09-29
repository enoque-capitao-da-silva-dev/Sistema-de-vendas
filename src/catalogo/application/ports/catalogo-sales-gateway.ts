import { DecreaseStockForSaleInput } from "../inputs/decrease-stock-for-sale.input";
import { RestoreStockFromSaleCancellationInput } from "../inputs/restore-stock-from-sale-cancellation.input";

export interface CatalogoSalesGateway {
  decreaseStock(
    input: DecreaseStockForSaleInput,
  ): Promise<void>;

  restoreStock(
    input: RestoreStockFromSaleCancellationInput,
  ): Promise<void>;
}

export const CATALOGO_SALES_GATEWAY = Symbol('CATALOGO_SALES_GATEWAY');