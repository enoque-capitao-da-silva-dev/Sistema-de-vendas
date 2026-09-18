export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency = 'AOA'): Money {
    if (!Number.isFinite(amount)) {
      throw new Error('Valor monetário inválido');
    }

    if (amount <= 0) {
      throw new Error('O valor monetário deve ser maior que zero');
    }

    return new Money(amount, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.amount &&
      this.currency === other.currency
    );
  }
}