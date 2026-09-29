import { Money } from "src/catalogo/domain/shared/money";

export class ItemCarrinho {
  constructor(
    private readonly produtoId: string,
    private produtoNome: string,
    private quantidade: number,
    private preco: Money,
    private subtotal: Money,
  ) {}

  static create(
    produtoId: string,
    produtoNome: string,
    quantidade: number,
    preco: number
  ): ItemCarrinho {

    if (!produtoId.trim()) {
      throw new Error('produtoId é obrigatório');
    }
    
    if (!produtoNome.trim()) {
      throw new Error('produtoNome é obrigatório');
    }
    
    if (!Number.isFinite(quantidade) || quantidade < 0) {
      throw new Error('A quantidade deve ser maior que zero');
    }
    
    if (!Number.isFinite(preco) || preco < 0) {
      throw new Error('O preco deve ser maior que zero');
    }
    
    return new ItemCarrinho(
      produtoId,
      produtoNome,
      quantidade,
      Money.create(preco),
      Money.create(quantidade * preco)
    );
  }

  alterarQuantidade(
    quantidade: number
  ): void {
    if (!Number.isFinite(quantidade)) {
      throw new Error('A quantidade deve um número finito');
    }

    const novaQuantidade = this.quantidade + quantidade;
    
    if (novaQuantidade < 1) {
      throw new Error('Quantidade deve maior que zero');
    }
    
    this.quantidade += quantidade;
    
    this.subtotal = this.calcularSubtotal(
      this.quantidade, this.preco.getAmount()
    );
  }

  private calcularSubtotal(
    quantidade: number, 
    preco: number
  ): Money {
    return Money.create(quantidade * preco);
  }

  getProdutoId(): string {
    return this.produtoId;
  }

  getProdutoNome(): string {
    return this.produtoNome;
  }

  getQuantidade(): number {
    return this.quantidade;
  }

  getPreco(): number {
    return this.preco.getAmount();
  }

  getMoeda(): string {
    return this.preco.getCurrency();
  }

  getSubtotal(): number {
    return this.subtotal.getAmount();
  }
}