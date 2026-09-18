import { Injectable, Inject } from '@nestjs/common';
import type { StockRepository } from '../../repositories/stock.repository';
import { STOCK_REPOSITORY } from '../../repositories/stock.repository';
import { StockMovementRepository } from '../../repositories/stock-movement.repository';
import { TRANSACTION_MANAGER } from '../shared/transaction-manager';
import type { TransactionManager } from '../shared/transaction-manager';
import { CLOCK } from '../../../domain/shared/clock';
import type { Clock } from '../../../domain/shared/clock';
import { ID_GENERATOR } from '../../../domain/shared/id-generator';
import type { IdGenerator } from '../../../domain/shared/id-generator';
import { StockMovementOrigin } from '../../../domain/enums/stock-movement-origin.enum';
import { AdjustStockInput } from '../../inputs/adjust-stock.input';

@Injectable()
export class AdjustStock {
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

  async execute(input: AdjustStockInput): Promise<void> {
    this.validate(input);
    /*if (!Number.isInteger(input.quantidadeReal) || input.quantidadeReal < 0) {
      //throw new InvalidStockQuantityError(input.quantidadeReal);
      throw new Error('Quantidade de estoque inválida');
    }

    if (!input.motivo?.trim()) {
      //throw new InvalidAdjustmentReasonError();
      throw new Error('Razão de ajuste inválida');
    }*/

    await this.transactionManager.run(async () => {
      const estoque = await this.stockRepository.findByProductIdsForUpdate([
        input.produtoId,
      ])[0];

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

  private validate(input: AdjustStockInput): void {
    if (!input.produtoId?.trim()) {
      throw new Error('O ID do produto é obrigatório');
    }

    if (!Number.isInteger(input.quantidadeReal) || input.quantidadeReal < 0) {
      throw new Error(
        'A quantidade real deve ser um inteiro maior ou igual a zero',
      );
    }

    if (!input.motivo?.trim()) {
      throw new Error('O motivo do ajuste é obrigatório');
    }

    if (input.motivo.trim().length > 500) {
      throw new Error('O motivo não pode exceder 500 caracteres');
    }
  }
}

/*
export class AdjustStock {
  constructor(
    private readonly stockRepository:
      StockRepository,

    private readonly idGenerator:
      IdGenerator,

    private readonly clock:
      Clock,

    private readonly transactionManager:
      TransactionManager,
  ) {}

  async execute(
    input: AdjustStockInput,
  ): Promise<void> {
    this.validate(input);

    await this.transactionManager.run(
      async () => {
        const stock =
          await this.stockRepository
            .findByProductIdForUpdate(
              input.productId,
            );

        if (!stock) {
          throw new Error(
            'Estoque do produto não encontrado',
          );
        }

        const quantidadeAtual =
          stock.getQuantidadeDisponivel();

        const diferenca =
          input.quantidadeReal -
          quantidadeAtual;

        if (diferenca === 0) {
          return;
        }

        const now =
          this.clock.now();

        if (diferenca > 0) {
          stock.entrar({
            id: this.idGenerator.generate(),
            quantidade: diferenca,
            origem: StockMovementOrigin.AJUSTE,
            referenciaId: null,
            motivo: input.motivo.trim(),
            createdAt: now,
          });
        } else {
          stock.sair({
            id: this.idGenerator.generate(),
            quantidade: Math.abs(diferenca),
            origem: StockMovementOrigin.AJUSTE,
            referenciaId: null,
            motivo: input.motivo.trim(),
            createdAt: now,
          });
        }

        await this.stockRepository.save(
          stock,
        );
      },
    );
  }

  
}
*/

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
