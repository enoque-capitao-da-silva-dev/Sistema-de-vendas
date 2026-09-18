import { Injectable, Inject } from "@nestjs/common";
import type { StockRepository } from '../../repositories/stock.repository';
import { STOCK_REPOSITORY } from '../../repositories/stock.repository';
import { StockMovementRepository } from '../../repositories/stock-movement.repository';
import type { TransactionManager } from '../shared/transaction-manager';
import type { Clock } from '../../../domain/shared/clock';
import type { IdGenerator } from '../../../domain/shared/id-generator';
import { StockMovementOrigin } from '../../../domain/enums/stock-movement-origin.enum';
import { AdjustStockInput } from '../../inputs/adjust-stock.input';

@Injectable()
export class AdjustStock {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: StockRepository,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(input: AdjustStockInput): Promise<void> {
    if (!Number.isInteger(input.quantidadeReal) || input.quantidadeReal < 0) {
      //throw new InvalidStockQuantityError(input.quantidadeReal);
      throw new Error('Quantidade de estoque inválida');
    }

    if (!input.motivo?.trim()) {
      //throw new InvalidAdjustmentReasonError();
      throw new Error('Razão de ajuste inválida');
    }

    await this.transactionManager.run(async () => {
      const estoque = await this.stockRepository.findByProductId(
        input.produtoId,
      );

      if (!estoque) {
        //throw new StockNotFoundError(input.productId);
        throw new Error('Estoque não encontrado');
      }

      const quantidadeAtual = estoque.getQuantidadeDisponivel();

      const diferenca = input.quantidadeReal - quantidadeAtual;

      if (diferenca === 0) {
        return;
      }

      if (diferenca > 0) {
        estoque.entrar({
          id: this.idGenerator.generate(),
          quantidade: diferenca,
          origem: StockMovementOrigin.AJUSTE,
          referenciaId: null,
          motivo: input.motivo,
          createdAt: this.clock.now(),
        });
      } else {
        estoque.sair({
          id: this.idGenerator.generate(),
          quantidade: Math.abs(diferenca),
          origem: StockMovementOrigin.AJUSTE,
          referenciaId: null,
          motivo: input.motivo,
          createdAt: this.clock.now(),
        });
      }

      await this.stockRepository.save(estoque);
    });
  }
}

/*
export class AdjustStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly movementRepository: StockMovementRepository,
    private readonly transactionManager: TransactionManager,
    private readonly clock: Clock,
  ) {}

  async execute(
    input: AdjustStockInput,
  ): Promise<void> {

    const estoque =
      await this.stockRepository.findByProductId(
        input.produtoId,
      );

    if (!estoque) {
      throw new Error('Estoque não encontrado');
    }

    const movimentacao = estoque.ajustar(
      input.quantidadeReal,
      input.motivo,
      null
    );

    if (!movimentacao) {
      return;
    }

    await this.transactionManager.run(async () => {
      await this.stockRepository.save(estoque);

      await this.movementRepository.save(
        movimentacao,
      );
    });
  }
}
*/
