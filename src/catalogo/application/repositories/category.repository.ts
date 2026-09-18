import { Categoria } from '../../domain/entities/categoria.entity';
import { CategoryStatus } from "../../domain/enums/category-status.enum";

export interface CategoryRepository {
  save(category: Categoria): Promise<void>;

  findById(id: string): Promise<Categoria | null>;

  findByName(nome: string): Promise<Categoria | null>;
  
  findAll(status: CategoryStatus): Promise<Categoria[]>;

  existsByName(nome: string, categoriaId?: string): Promise<boolean>;
}

export const CATEGORY_REPOSITORY = Symbol(
  'CATEGORY_REPOSITORY',
);
