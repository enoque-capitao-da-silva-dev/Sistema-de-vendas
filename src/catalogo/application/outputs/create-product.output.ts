import { ProductStatus } from "../../domain/enums/product-status.enum";

export interface CreateProductOutput {
  id: string;
  categoriaId: string;
  nome: string;
  descricao: string | null;
  preco: number;
  currency: string;
  status: ProductStatus;
  estoqueInicial: number;
}