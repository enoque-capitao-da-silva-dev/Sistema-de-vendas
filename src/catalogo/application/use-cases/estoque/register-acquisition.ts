import { Injectable, Inject } from '@nestjs/common';
import type { StockRepository } from '../../repositories/stock.repository';
import { STOCK_REPOSITORY } from '../../repositories/stock.repository';
import { StockMovementRepository } from '../../repositories/stock-movement.repository';
import { StockMovementOrigin } from '../../../domain/enums/stock-movement-origin.enum';
import { RegisterAcquisitionInput } from '../../inputs/register-acquisition.input';
import type { TransactionManager } from '../shared/transaction-manager';
import { TRANSACTION_MANAGER } from '../shared/transaction-manager';
import type { IdGenerator } from '../../../domain/shared/id-generator';
import { ID_GENERATOR } from '../../../domain/shared/id-generator';
import type { Clock } from '../../../domain/shared/clock';
import { CLOCK } from '../../../domain/shared/clock';

@Injectable()
export class RegisterAcquisition {
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

  async execute(input: RegisterAcquisitionInput): Promise<void> {
    this.validate(input);
    /*
    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      //throw new InvalidStockQuantityError(input.quantity);
      throw new Error('Quantidade de estoque inválida');
    }*/

    await this.transactionManager.run(async () => {
      const estoque = await this.stockRepository.findByProductIdsForUpdate(
        [input.productId],
      );

      if (!estoque) {
        //throw new StockNotFoundError(input.productId);
        throw new Error('Estoque não encontrado');
      }

      estoque[0].entrar({
        id: this.idGenerator.generate(),
        quantidade: input.quantity,
        origem: StockMovementOrigin.AQUISICAO,
        referenciaId: input.referenceId ?? null,
        motivo: input.reason ?? null,
        createdAt: this.clock.now(),
      });

      await this.stockRepository.save(estoque[0]);
    });
    
  }

  private validate(input: RegisterAcquisitionInput): void {
    if (!input.productId?.trim()) {
      throw new Error('O ID do produto é obrigatório');
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      throw new Error('A quantidade deve ser um inteiro maior que zero');
    }

    if (
      input.reason !== undefined &&
      input.reason !== null &&
      input.reason.trim().length > 500
    ) {
      throw new Error('O motivo não pode exceder 500 caracteres');
    }
  }
}

/*
export class RegisterAcquisition {
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
    input: RegisterAcquisitionInput,
  ): Promise<void> {
    this.validate(input);

    const stock =
      await this.stockRepository.findByProductId(
        input.productId,
      );

    if (!stock) {
      throw new Error(
        'Estoque do produto não encontrado',
      );
    }

    await this.transactionManager.run(
      async () => {
        stock.entrar({
          id: this.idGenerator.generate(),
          quantidade: input.quantity,
          origem: StockMovementOrigin.AQUISICAO,
          referenciaId:
            input.referenceId ?? null,
          motivo:
            input.reason?.trim() || null,
          createdAt: this.clock.now(),
        });

        await this.stockRepository.save(stock);
      },
    );
  }

  private validate(
    input: RegisterAcquisitionInput,
  ): void {
    if (!input.productId?.trim()) {
      throw new Error(
        'O ID do produto é obrigatório',
      );
    }

    if (
      !Number.isInteger(input.quantity) ||
      input.quantity <= 0
    ) {
      throw new Error(
        'A quantidade deve ser um inteiro maior que zero',
      );
    }

    if (
      input.reason !== undefined &&
      input.reason !== null &&
      input.reason.trim().length > 500
    ) {
      throw new Error(
        'O motivo não pode exceder 500 caracteres',
      );
    }
  }
}
*/

/*
export class RegisterAcquisition {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly movementRepository: StockMovementRepository,
    private readonly transactionManager: TransactionManager
  ) {}

  async execute(
    input: RegisterAcquisitionInput,
  ): Promise<void> {
    const estoque =
      await this.stockRepository.findByProductId(
        input.produtoId,
      );

    if (!estoque) {
      throw new Error('Estoque não encontrado');
    }

    estoque.entrar({
      id: '',
      quantidade: input.quantidade,
      origem: StockMovementOrigin.AQUISICAO,
      referenciaId: input.referenciaId ?? null,
      createdAt: new Date()
    });

    
    *  em un sistema concorrente essa transacao 
    *  vai causar problema, se dois operadores 
    *  realizarem a operaço ao mesmo tempo, por isso 
    *  a transacao precisa considerar a concorrência 
    *  otimista/pessimista, isolamento transacional e 
    *  locking
    *
    await this.transactionManager.run(async () => {
      await this.stockRepository.save(estoque);

      //await this.movementRepository.save(
      //  movimentacao,
      //);
    });
  }
}*/
