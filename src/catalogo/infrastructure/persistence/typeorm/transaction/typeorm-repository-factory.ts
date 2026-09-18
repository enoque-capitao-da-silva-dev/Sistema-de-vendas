import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { TransactionContextService } from './transaction-context.service';

@Injectable()
export class TypeOrmRepositoryFactory {
  constructor(
    private readonly dataSource: DataSource,
    private readonly transactionContext: TransactionContextService,
  ) {}

  getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    const manager = this.transactionContext.getManager();

    if (manager) {
      return manager.getRepository(entity);
    }

    return this.dataSource.getRepository(entity);
  }

  getTransactionalRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    const manager = this.transactionContext.getManager();

    if (!manager) {
      throw new Error(
        'Repository transacional utilizado fora de uma transação',
      );
    }

    return manager.getRepository(entity);
  }
}
