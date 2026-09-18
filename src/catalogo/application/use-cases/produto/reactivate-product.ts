import { ProductRepository } from "../../repositories/product.repository";
import { CategoryRepository } from "../../repositories/category.repository";
import { ReactivateProductInput } from "../../inputs/reactivate-product.input";


export class ReactivateProduct {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: ReactivateProductInput,
  ): Promise<void> {
    const produto = await this.productRepository.findById(
      input.produtoId,
    );

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const categoria = await this.categoryRepository.findById(
      produto.getCategoriaId(),
    );

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    if (!categoria.estaAtiva()) {
      throw new Error(
        'Não é possível reativar um produto de uma categoria desativada',
      );
    }

    produto.reativar();

    await this.productRepository.save(produto);
  }
}