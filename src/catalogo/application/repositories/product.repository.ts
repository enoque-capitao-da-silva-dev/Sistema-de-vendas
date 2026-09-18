import { Produto } from '../../domain/entities/produto.entity';
import { ProductQuery } from "../inputs/product-query";
import { ProductPage } from "../outputs/product-page";

export interface ProductRepository {
  save(proeuct: Produto): Promise<void>;

  findById(id: string): Promise<Produto | null>;

  findByName(nome: string): Promise<Produto | null>;
  
  findAll(query: ProductQuery): Promise<ProductPage>;

  existsByName(nome: string, productId?: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');