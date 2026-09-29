import { ItemCarrinho } from "./item-carrinho.entity";
import { Money } from "src/catalogo/domain/shared/money";

export class Carrinho {
  private readonly items = new Map<string, ItemCarrinho>();
  
  constructor(
    private readonly id: string,
  ) {}

  adicionar(item: ItemCarrinho): void {
    if (!item) {
      throw new Error('Item é obrigatório');
    }

    if (this.items.has(item.getProdutoId())) {
      const itemAnterior = this.items.get(item.getProdutoId())!;
      item.alterarQuantidade(itemAnterior.getQuantidade());
    }
    
    this.items.set(item.getProdutoId(), item);
  }

  alterarQuantidade(
    produtoId: string,
    quantidade: number
  ): void {
    if (!produtoId.trim()) {
      throw new Error('ID do produto é obrigatório');
    }
    
    if (!Number.isFinite(quantidade)) {
      throw new Error('A quantidade deve ser um númeto finito');
    }
    
    if (!this.items.has(produtoId)) {
      throw new Error(`O carrino não tem o produto com ID: ${produtoId}`);
    }

    const item = this.items.get(produtoId)!;

    if((item.getQuantidade() + quantidade) < 1) {
      this.removerItem(produtoId);
    } else {      
      item.alterarQuantidade(quantidade);     
      this.items.set(produtoId, item);
    }
  }

  removerItem(produtoId: string): void {
    if (!produtoId.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    if (!this.items.has(produtoId)) {
      throw new Error(`O carrino não tem o produto com ID: ${produtoId}`);
    }

    this.items.delete(produtoId);
  }

  getItems(): readonly ItemCarrinho[] {

    if (this.items.size === 0) {
      return [];
    }
    const items: ItemCarrinho[] = [];

    for (const key of this.items.keys()) {
      const item = this.items.get(key);
      
      if (item) { items.push(item); }
    }
    
    return items;
  }
  
  calcularTotal(): number {
    
    let total = 0;

    for (const key of this.items.keys()) {
      const item = this.items.get(key);
      
      if (item) {
        total += item.getSubtotal();
      }
    }
    
    return total;
  }

  esvaziar(): void {
    this.items.clear();
  }
  
}

/*
const car = new Carrinho('1234');

const item1 = ItemCarrinho.create(
  'produtoId-1',
  'Teclado',
  7,
  100,
);

const item2 = ItemCarrinho.create(
  'produtoId-2',
  'Teclado',
  7,
  200,
);

car.adicionar(item1);
car.adicionar(item2);

car.alterarQuantidade(item1.getProdutoId(), 3);

console.log(car);
console.log(item1);
console.log(item2);

//car.esvaziar();

car.removerItem(item1.getProdutoId());

console.log(car.calcularTotal());

//item1.alterarQuantidade(-6);


console.log(car.getItems());
*/