import { Injectable, Inject } from "@nestjs/common";
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
      //throw new InvalidSaleReferenceError();
      throw new Error('Referência de venda invalida');
    }

    if (input.items.length === 0) {
      //throw new EmptySaleItemsError();
      throw new Error('Venda sem itens');
    }

    for (const item of input.items) {
      if (!item.productId?.trim()) {
        //throw new InvalidProductReferenceError();
        throw new Error('Referência de venda invalida');
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        //throw new InvalidStockQuantityError(item.quantity);
        throw new Error('Quantidade inválida de estoque');
      }
    }

    await this.transactionManager.run(async () => {
      const productIds = input.items.map((item) => item.productId).sort();

      const uniqueProductIds = new Set(productIds);

      if (uniqueProductIds.size !== productIds.length) {
        //throw new DuplicateSaleItemError();
        throw new Error('Itens de venda duplicados');
      }

      const estoques = await this.stockRepository.findByProductIdsForUpdate(productIds);

      if(!estoques) {
        throw new Error('Estoque não encontrado');
      }

      const stockByProductId = new Map(
        estoques.map((estoque) => [estoque.getProdutoId(), estoque]),
      );

      /*
       * 1. Verificar existência
       */
      for (const item of input.items) {
        const estoque = stockByProductId.get(item.productId);

        if (!estoque) {
          //throw new StockNotFoundError(item.productId);
          throw new Error('Estoque não encontrado');
        }
      }

      /*
       * 2. Verificar quantidade
       */
      for (const item of input.items) {
        const estoque = stockByProductId.get(item.productId)!;

        if (estoque.getQuantidadeDisponivel() < item.quantity) {
          /*throw new InsufficientStockError(
            item.productId,
            item.quantity,
            estoque.getQuantidadeDisponivel(),
          );*/
          throw new Error('Estoque insuficiente');
        }
      }

      /*
       * 3. Efetuar as baixas
       */
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

        await this.stockRepository.save(estoque);
      }
    });
  }
}

/*
export class DecreaseStockForSale {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly movementRepository: StockMovementRepository,
    private readonly transactionManager: TransactionManager,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(
    input: DecreaseStockForSaleInput,
  ): Promise<void> {
    // implementação
  }
}


export interface DecreaseStockForSale {
  execute(
    input: DecreaseStockForSaleInput,
  ): Promise<void>;
}
*/
