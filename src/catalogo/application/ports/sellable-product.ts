import { Money } from "../../domain/shared/money";

export interface SellableProduct {
  id: string;
  nome: string;
  preco: Money;
}