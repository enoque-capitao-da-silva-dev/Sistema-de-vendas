import { Injectable, Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "../../repositories/product.repository";
import type { ProductRepository } from "../../repositories/product.repository";
import { DeactivateProductInput } from "../../inputs/deactivate-product.input";
import { MyCustomError } from "../../../errors/my-custom.error";

@Injectable()
export class DeactivateProduct {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: DeactivateProductInput,
  ): Promise<void> {
    const produto = await this.productRepository.findById(
      input.produtoId,
    );

    if (!produto) {
      throw new MyCustomError('Produto não encontrado');
    }

    produto.desativar();

    await this.productRepository.save(produto);
  }
}