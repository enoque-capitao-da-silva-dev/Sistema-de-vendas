
export interface CreateProductDto {
  categoriaId: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  currency: string;
  estoqueInicial: number;
}