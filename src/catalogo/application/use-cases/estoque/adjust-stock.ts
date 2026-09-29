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
import { MyCustomError } from "../../../errors/my-custom.error";

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

    await this.transactionManager.run(async () => {
      const stock = await this.stockRepository.findByProductIdsForUpdate([
        input.produtoId,
      ]);

      const estoque = stock[0];

      if (!estoque) {
        throw new MyCustomError('Estoque não encontrado');
      }

      const quantidadeAtual = estoque.getQuantidadeDisponivel();

      const diferenca = input.quantidadeReal - quantidadeAtual;

      if (diferenca === 0) {
        //return;
        throw new MyCustomError(
          'Ajuste não realizada, porque a quantidade real informada ê mesmo já existente no sistema.'
        );
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
      throw new MyCustomError('O ID do produto é obrigatório');
    }

    if (!Number.isInteger(input.quantidadeReal) || input.quantidadeReal < 0) {
      throw new MyCustomError(
        'A quantidade real deve ser um inteiro maior ou igual a zero',
      );
    }

    if (!input.motivo?.trim()) {
      throw new MyCustomError('O motivo do ajuste é obrigatório');
    }

    if (input.motivo.trim().length > 500) {
      throw new MyCustomError('O motivo não pode exceder 500 caracteres');
    }
  }
}