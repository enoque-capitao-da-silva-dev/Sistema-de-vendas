import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { EntityManager } from 'typeorm';

interface TransactionContext {
  manager: EntityManager;
}

@Injectable()
export class TransactionContextService {
  private readonly storage = new AsyncLocalStorage<TransactionContext>();

  run<T>(manager: EntityManager, operation: () => Promise<T>): Promise<T> {
    return this.storage.run({ manager }, operation);
  }

  getManager(): EntityManager | undefined {
    return this.storage.getStore()?.manager;
  }
}
