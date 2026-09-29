export class ProductsNotSellableError extends Error {
  constructor(public readonly productIds: string[]) {
    super('Um ou mais produtos não estão disponíveis para venda');
  }
}
