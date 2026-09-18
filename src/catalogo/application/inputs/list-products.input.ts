import { ProductStatus } from "../../domain/enums/product-status.enum";

export interface ListProductsInput {
  page: number;
  limit: number;
  nome?: string;
  categoriaId?: string;
  status?: ProductStatus;
}
