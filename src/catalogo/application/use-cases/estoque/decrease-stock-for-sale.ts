import { Injectable, Inject } from '@nestjs/common';
import type { StockRepository } from '../../repositories/stock.repository';
import { STOCK_REPOSITORY } from '../../repositories/stock.repository';
import { StockMovementRepository } from '../../repositories/stock-movement.repository';
import { DecreaseStockForSaleInput } from '../../inputs/decrease-stock-for-sale.input';
import type { TransactionManager } from '../shared/transaction-manager';
import { TRANSACTION_MANAGER } from '../shared/transaction-manager';
import type { IdGenerator } from '../../../domain/shared/id-generator';
import { ID_GENERATOR } from '../../../domain/shared/id-generator';
import type { Clock } from '../../../domain/shared/clock';
import { CLOCK } from '../../../domain/shared/clock';
import { StockMovementOrigin } from '../../../domain/enums/stock-movement-origin.enum';
import { MyCustomError } from '../../../errors/my-custom.error';
import { QueryFailedError } from 'typeorm';
import { IdempotencyKeyAlreadyExistsError } from '../../errors/idempotency-key-already-exists.error';

@Injectable()
export class DecreaseStockForSale {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: StockRepository,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(input: DecreaseStockForSaleInput): Promise<void> {
    if (!input.saleId?.trim()) {
      throw new MyCustomError('Referência de venda invalida');
    }

    if (input.items.length === 0) {
      throw new MyCustomError('Venda sem itens');
    }

    for (const item of input.items) {
      if (!item.productId?.trim()) {
        throw new MyCustomError('Referência de venda invalida');
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new MyCustomError('Quantidade inválida de estoque');
      }
    }

    //await this.transactionManager.run(async () => {
      const productIds = input.items.map((item) => item.productId).sort();

      const uniqueProductIds = new Set(productIds);

      if (uniqueProductIds.size !== productIds.length) {
        throw new MyCustomError('Itens de venda duplicados');
      }

      const estoques =
        await this.stockRepository.findByProductIdsForUpdate(productIds);

      if (estoques.length === 0) {
        throw new MyCustomError('Estoque não encontrado');
      }

      const stockByProductId = new Map(
        estoques.map((estoque) => [estoque.getProdutoId(), estoque]),
      );

      // 1. Verificar existência
      for (const item of input.items) {
        const estoque = stockByProductId.get(item.productId);

        if (!estoque) {
          //throw new StockNotFoundError(item.productId);
          throw new MyCustomError('Estoque não encontrado');
        }
      }

      // 2. Verificar quantidade
      for (const item of input.items) {
        const estoque = stockByProductId.get(item.productId)!;

        if (estoque.getQuantidadeDisponivel() < item.quantity) {
          throw new MyCustomError('Estoque insuficiente');
        }
      }

      // 3. Efetuar as baixas
      for (const item of input.items) {
        const estoque = stockByProductId.get(item.productId)!;

        estoque.sair({
          id: this.idGenerator.generate(),
          quantidade: item.quantity,
          origem: StockMovementOrigin.VENDA,
          referenciaId: input.saleId,
          motivo: null,
          createdAt: this.clock.now(),
        });
      }

      /*
       * 4. Persistir
       */
      for (const item of input.items) {
        const estoque = stockByProductId.get(item.productId)!;


        try {
          await this.stockRepository.save(estoque);
          //await this.stockRepository.saveMany(estoques);
        } catch (error) {
          if (this.isIdempotencyConstraintError(error)) {
            throw new IdempotencyKeyAlreadyExistsError();
          }

          throw error;
        }
      }
    //});
  }

  private isIdempotencyConstraintError(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError;

    return (
      driverError.code === 'ER_DUP_ENTRY' &&
      driverError.sqlMessage?.includes(
        'uq_decrease_stock_for_sale_reference',
      )
    );
  }
}
