import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionManager } from '../../../../application/use-cases/shared/transaction-manager';
import { TransactionContextService } from './transaction-context.service';

@Injectable()
export class TypeOrmTransactionManager implements TransactionManager {
  constructor(
 //   @InjectRepository(DataSource)
    private readonly dataSource: DataSource,
    private readonly transactionContext: TransactionContextService,
  ) {}

  async run<T>(operation: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      return this.transactionContext.run(manager, operation);
    });
  }
}
