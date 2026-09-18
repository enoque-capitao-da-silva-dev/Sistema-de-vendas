export interface RestoreStockFromSaleCancellationInput {
  saleId: string;

  items: Array<{
    productId: string;
    quantity: number;
  }>;
}