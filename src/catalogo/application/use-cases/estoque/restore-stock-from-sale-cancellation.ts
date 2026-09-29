import { Injectable, Inject } from '@nestjs/common';
import { RestoreStockFromSaleCancellationInput } from '../../inputs/restore-stock-from-sale-cancellation.input';
import type { StockMovementReader } from '../../repositories/stock-movement-reader';
import { STOCK_MOVEMENT_READER } from '../../repositories/stock-movement-reader';
import type { StockRepository } from '../../repositories/stock.repository';
import { STOCK_REPOSITORY } from '../../repositories/stock.repository';
import { StockMovementOrigin } from '../../../domain/enums/stock-movement-origin.enum';
import type { TransactionManager } from '../shared/transaction-manager';
import { TRANSACTION_MANAGER } from '../shared/transaction-manager';
import type { IdGenerator } from '../../../domain/shared/id-generator';
import { ID_GENERATOR } from '../../../domain/shared/id-generator';
import type { Clock } from '../../../domain/shared/clock';
import { CLOCK } from '../../../domain/shared/clock';
import { MyCustomError } from '../../../errors/my-custom.error';
import { QueryFailedError } from 'typeorm';
import { IdempotencyKeyAlreadyExistsError } from '../../errors/idempotency-key-already-exists.error';

@Injectable()
export class RestoreStockFromSaleCancellation {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: StockRepository,
    @Inject(STOCK_MOVEMENT_READER)
    private readonly stockMovementReader: StockMovementReader,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(input: RestoreStockFromSaleCancellationInput): Promise<void> {
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

      if (!estoques) {
        throw new MyCustomError('Estoques não encontrados');
      }
      
      const stockByProductIds = new Map(
        estoques.map((estoque) => [estoque.getProdutoId(), estoque]),
      );

      const stockMovements = await this.stockMovementReader.findBySaleId(
        input.saleId,
      );
      const stockMovementByStockIds = new Map(
        stockMovements.items.map((item) => [item.getEstoqueId(), item]),
      );

      if (
        uniqueProductIds.size !== estoques.length 
        //|| uniqueProductIds.size !== stockMovements.items.length
      ) {
        throw new MyCustomError(
          'Quantidades incompativeis entre items informados e estoques retornados',
        );
      }
      

      /**
       *  verifica se cada estoque que precisa ser restaurado
       *  teve o seu produto participado da venda.
       *  E se as quantidades que precisam restauradas
       *  a cada estoque, foram exatamente as mesmas quantidades
       *  rrgietradas na venda
       */
      for (const item of input.items) {
        const estoque = stockByProductIds.get(item.productId);

        if (!estoque) {
          throw new MyCustomError(
            `Estoque não encontrado para o produto com ID: ${item.productId}`,
          );
        }

        const stockMovement = stockMovementByStockIds.get(estoque.getId());

        if (!stockMovement) {
          throw new MyCustomError(
            `A movimentação do estoque não encontrado para o produto com ID: ${item.productId}`,
          );
        }

        if (stockMovement.getEstoqueId() !== estoque.getId()) {
          throw new MyCustomError(
            `Produto com ID: ${item.productId} não pertence a venda`,
          );
        }

        if (stockMovement.getQuantidade() !== item.quantity) {
          throw new MyCustomError(
            `Quantidade do produto com ID: ${item.productId} não corresponde à quantidade registrada na venda`,
          );
        }
      }

      for (const item of input.items) {
        const estoque = stockByProductIds.get(item.productId)!;

        estoque.entrar({
          id: this.idGenerator.generate(),
          quantidade: item.quantity,
          origem: StockMovementOrigin.CANCELAMENTO_VENDA,
          referenciaId: input.saleId,
          motivo: null,
          createdAt: this.clock.now(),
        });
        
      }

      for (const item of input.items) {
        const estoque = stockByProductIds.get(item.productId)!;

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
        'uq_restore_stock_from_sale_reference',
      )
    );
  }
}
