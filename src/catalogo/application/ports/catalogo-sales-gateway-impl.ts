import { Injectable } from '@nestjs/common';
import { DecreaseStockForSaleInput } from '../inputs/decrease-stock-for-sale.input';
import { RestoreStockFromSaleCancellationInput } from '../inputs/restore-stock-from-sale-cancellation.input';
import { CatalogoSalesGateway } from './catalogo-sales-gateway';
import { DecreaseStockForSale } from '../use-cases/estoque/decrease-stock-for-sale';
import { RestoreStockFromSaleCancellation } from '../use-cases/estoque/restore-stock-from-sale-cancellation';

@Injectable()
export class CatalogoSalesGatewayImpl implements CatalogoSalesGateway {
  constructor(
    private readonly decreaseStockForSale: DecreaseStockForSale,
    private readonly restoreStockFromSaleCancellation: RestoreStockFromSaleCancellation,
  ) {}

  async decreaseStock(input: DecreaseStockForSaleInput): Promise<void> {
    await this.decreaseStockForSale.execute(input);
  }

  async restoreStock(
    input: RestoreStockFromSaleCancellationInput,
  ): Promise<void> {
    await this.restoreStockFromSaleCancellation.execute(input);
  }
}
