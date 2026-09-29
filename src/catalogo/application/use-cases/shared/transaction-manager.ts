export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  run<T>(
    operation: () => Promise<T>,
  ): Promise<T>;
}