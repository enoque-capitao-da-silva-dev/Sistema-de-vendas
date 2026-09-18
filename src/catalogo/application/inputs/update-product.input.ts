export interface UpdateProductInput {
  produtoId: string;
  nome: string;
  descricao: string | null;
  preco: number;
  categoriaId: string;
}