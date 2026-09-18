import { ProductStatus } from "../../domain/enums/product-status.enum";

export interface ProductQuery {
  page: number;
  limit: number;
  nome?: string;
  categoriaId?: string;
  status?: ProductStatus;
}