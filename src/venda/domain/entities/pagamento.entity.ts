import { Money } from 'src/catalogo/domain/shared/money';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class Pagamento {
  private constructor(
    private readonly id: string,
    private readonly vendaId: string,
    private readonly valor: Money,
    private readonly metodo: PaymentMethod,
    private status: PaymentStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    vendaId: string;
    valor: Money;
    metodo: PaymentMethod;
    createdAt: Date;
  }): Pagamento {
    if (!data.id?.trim()) {
      throw new Error('O ID do pagamento é obrigatório');
    }

    if (!data.vendaId?.trim()) {
      throw new Error('A venda é obrigatória');
    }

    return new Pagamento(
      data.id,
      data.vendaId,
      data.valor,
      data.metodo,
      PaymentStatus.PAGO,
      data.createdAt,
      data.createdAt,
    );
  }

  static restore(data: {
    id: string;
    vendaId: string;
    valor: Money;
    metodo: PaymentMethod;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Pagamento {
    return new Pagamento(
      data.id,
      data.vendaId,
      data.valor,
      data.metodo,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  cancelar(updatedAt: Date): void {
    if (this.status === PaymentStatus.CANCELADO) {
      throw new Error('O pagamento já está cancelado');
    }

    this.status = PaymentStatus.CANCELADO;

    this.updatedAt = updatedAt;
  }

  isCancelled(): boolean {
    return this.status === PaymentStatus.CANCELADO;
  }

  getId(): string {
    return this.id;
  }

  getVendaId(): string {
    return this.vendaId;
  }

  getValor(): Money {
    return this.valor;
  }

  getMetodo(): PaymentMethod {
    return this.metodo;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
