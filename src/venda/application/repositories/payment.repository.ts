import { Pagamento } from "../../domain/entities/pagamento.entity";

export interface PaymentRepository {
  save(payment: Pagamento): Promise<void>;

  findBySaleId(
    saleId: string,
  ): Promise<Pagamento | null>;
}

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');