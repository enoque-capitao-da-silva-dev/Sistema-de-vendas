import { Money } from "src/catalogo/domain/shared/money";

export class ItemVenda {
  private constructor(
    private readonly id: string,
    private readonly productId: string,
    private readonly productName: string,
    private readonly unitPrice: Money,
    private readonly quantity: number,
    private readonly subtotal: Money,
  ) {}

  /*
  static create(data: SaleItemData): ItemVenda {
    if (!data.id?.trim()) {
      throw new Error(
        'O ID do item é obrigatório',
      );
    }

    if (!data.productId?.trim()) {
      throw new Error(
        'O produto é obrigatório',
      );
    }

    if (!data.productName?.trim()) {
      throw new Error(
        'O nome do produto é obrigatório',
      );
    }

    if (
      !Number.isInteger(data.quantity) ||
      data.quantity <= 0
    ) {
      throw new Error(
        'A quantidade deve ser maior que zero',
      );
    }

    const expectedSubtotal =
      data.unitPrice.getAmount() *
      data.quantity;

    if (
      data.subtotal.getAmount() !==
      expectedSubtotal
    ) {
      throw new Error(
        'O subtotal do item é inválido',
      );
    }

    return new ItemVenda(
      data.id,
      data.productId,
      data.productName.trim(),
      data.unitPrice,
      data.quantity,
      data.subtotal,
    );
  }
*/

  static create(data: {
    id: string;
    productId: string;
    productName: string;
    unitPrice: Money;
    quantity: number;
  }): ItemVenda {
    if (!data.id?.trim()) {
      throw new Error('O ID do item é obrigatório');
    }

    if (!data.productId?.trim()) {
      throw new Error('O produto é obrigatório');
    }

    if (!data.productName?.trim()) {
      throw new Error('O nome do produto é obrigatório');
    }

    if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
      throw new Error('A quantidade deve ser maior que zero');
    }

    const subtotal = Money.create(
      data.unitPrice.getAmount() * data.quantity,
      data.unitPrice.getCurrency(),
    );

    return new ItemVenda(
      data.id,
      data.productId,
      data.productName.trim(),
      data.unitPrice,
      data.quantity,
      subtotal,
    );
  }

  static restore(data: {
    id: string,
    productId: string,
    productName: string,
    unitPrice: number,
    currency: string,
    quantity: number,
    subtotal: number
  }): ItemVenda {
    return new ItemVenda(
      data.id,
      data.productId,
      data.productName,
      Money.create(data.unitPrice, data.currency),
      data.quantity,
      Money.create(data.subtotal, data.currency)
    );
  }

  getId(): string {
    return this.id;
  }

  getProductId(): string {
    return this.productId;
  }

  getProductName(): string {
    return this.productName;
  }

  getUnitPrice(): Money {
    return this.unitPrice;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getSubtotal(): Money {
    return this.subtotal;
  }
}
