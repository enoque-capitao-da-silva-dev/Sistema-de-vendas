import { Estoque } from '../../domain/entities/estoque.entity';

export interface StockRepository {
  save(stock: Estoque): Promise<void>;

  findByProductId(produtoId: string): Promise<Estoque | null>;

  findByProductIds(produtoId: string[]): Promise<Estoque[] | null>;

  findByProductIdsForUpdate(productIds: string[]): Promise<Estoque[]>;
  /*
  findByName(nome: string): Promise<Categoria | null>;
  
  findAll(status: CategoryStatus): Promise<Categoria[]>;

  existsByName(nome: string): Promise<boolean>;
*/
}

export const STOCK_REPOSITORY = Symbol('STOCK_REPOSITORY');
