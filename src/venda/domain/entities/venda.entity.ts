import { Money } from 'src/catalogo/domain/shared/money';
import { ItemVenda } from './item-venda.entity';
import { SaleStatus } from '../enums/sale-status.enum';

export class Venda {
  private constructor(
    private readonly id: string,
    private readonly sessaoCaixaId: string,
    private readonly itens: ItemVenda[],
    private readonly total: Money,
    private status: SaleStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    sessaoCaixaId: string;
    itens: ItemVenda[];
    createdAt: Date;
  }): Venda {
    if (!data.id?.trim()) {
      throw new Error('O ID da venda é obrigatório');
    }

    if (!data.sessaoCaixaId?.trim()) {
      throw new Error('A sessão do caixa é obrigatória');
    }

    if (data.itens.length === 0) {
      throw new Error('A venda deve possuir pelo menos um item');
    }

    const totalAmount = data.itens.reduce(
      (total, item) => total + item.getSubtotal().getAmount(),
      0,
    );

    const currency = data.itens[0].getSubtotal().getCurrency();

    const total = Money.create(totalAmount, currency);

    return new Venda(
      data.id,
      data.sessaoCaixaId,
      [...data.itens],
      total,
      SaleStatus.CONCLUIDA,
      data.createdAt,
      data.createdAt,
    );
  }

  static restore(data: {
    id: string;
    sessaoCaixaId: string;
    items: ItemVenda[];
    total: number;
    moeda: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Venda {
    return new Venda(
      data.id,
      data.sessaoCaixaId,
      data.items,
      Money.create(data.total, data.moeda),
      data.status as SaleStatus,
      data.createdAt,
      data.updatedAt,
    );
  }

  cancelar(updatedAt: Date): void {
    if (this.status === SaleStatus.CANCELADA) {
      throw new Error('A venda já está cancelada');
    }

    this.status = SaleStatus.CANCELADA;
    this.updatedAt = updatedAt;
  }

  isCancelled(): boolean {
    return this.status === SaleStatus.CANCELADA;
  }

  getId(): string {
    return this.id;
  }

  getSessaoCaixaId(): string {
    return this.sessaoCaixaId;
  }

  getItens(): readonly ItemVenda[] {
    return this.itens;
  }

  getTotal(): Money {
    return this.total;
  }

  getStatus(): SaleStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
