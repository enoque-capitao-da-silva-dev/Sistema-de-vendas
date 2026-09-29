import { PaymentMethod } from "../../domain/enums/payment-method.enum";


export interface CreateSaleInput {
  sessaoCaixaId: string;

  items: Array<{
    productId: string;
    quantity: number;
  }>;

  paymentMethod: PaymentMethod;
}