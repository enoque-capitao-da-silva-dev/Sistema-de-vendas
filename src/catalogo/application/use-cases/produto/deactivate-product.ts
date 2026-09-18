import { ProductRepository } from "../../repositories/product.repository";
import { DeactivateProductInput } from "../../inputs/deactivate-product.input";

export class DeactivateProduct {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: DeactivateProductInput,
  ): Promise<void> {
    const produto = await this.productRepository.findById(
      input.produtoId,
    );

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    produto.desativar();

    await this.productRepository.save(produto);
  }
}