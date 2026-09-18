export interface DecreaseStockForSaleInput {
  saleId: string;

  items: Array<{
    productId: string;
    quantity: number;
  }>;
}