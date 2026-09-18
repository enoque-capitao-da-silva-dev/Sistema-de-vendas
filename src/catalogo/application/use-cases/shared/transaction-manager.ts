export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  run<T>(
    operation: () => Promise<T>,
  ): Promise<T>;
}

/*
await this.transactionManager.run(
  async () => {
    await this.productRepository.save(
      produto,
    );

    await this.stockRepository.save(
      estoque,
    );

    if (movimentacao) {
      await this.stockMovementRepository.save(
        movimentacao,
      );
    }
  },
);
*/