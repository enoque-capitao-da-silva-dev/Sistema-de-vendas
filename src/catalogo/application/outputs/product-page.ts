import { Produto } from "../../domain/entities/produto.entity";

export interface ProductPage {
  items: Produto[];
  page: number;
  limit: number;
  total: number;
}