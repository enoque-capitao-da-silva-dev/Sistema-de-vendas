export interface CancelSaleInput {
  saleId: string;

  actor: {
    userId: string;
    role: 'CAIXA' | 'GERENTE';
  };
}