import { Injectable, Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "../../repositories/product.repository";
import type { ProductRepository } from "../../repositories/product.repository";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";
import type { CategoryRepository } from "../../repositories/category.repository";
import { ReactivateProductInput } from "../../inputs/reactivate-product.input";
import { MyCustomError } from "../../../errors/my-custom.error";

@Injectable()
export class ReactivateProduct {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: ReactivateProductInput,
  ): Promise<void> {
    const produto = await this.productRepository.findById(
      input.produtoId,
    );

    if (!produto) {
      throw new MyCustomError('Produto não encontrado');
    }

    const categoria = await this.categoryRepository.findById(
      produto.getCategoriaId(),
    );

    if (!categoria) {
      throw new MyCustomError('Categoria não encontrada');
    }

    if (!categoria.estaAtiva()) {
      throw new MyCustomError(
        'Não é possível reativar um produto de uma categoria desativada',
      );
    }

    produto.reativar();

    await this.productRepository.save(produto);
  }
}