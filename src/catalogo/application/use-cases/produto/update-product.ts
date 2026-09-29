import { Injectable, Inject } from "@nestjs/common";
import type { ProductRepository } from "../../repositories/product.repository";
import { PRODUCT_REPOSITORY } from "../../repositories/product.repository";
import type { CategoryRepository } from "../../repositories/category.repository";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";
import { UpdateProductInput } from "../../inputs/update-product.input";
import { Money } from "../../../domain/shared/money";
import { MyCustomError } from "../../../errors/my-custom.error";

@Injectable()
export class UpdateProduct {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: UpdateProductInput): Promise<void> {
    const produto = await this.productRepository.findById(
      input.produtoId,
    );

    if (!produto) {
      throw new MyCustomError('Produto não encontrado');
    }

    const categoria = await this.categoryRepository.findById(
      input.categoriaId,
    );

    if (!categoria) {
      throw new MyCustomError('Categoria não encontrada');
    }

    if (!categoria.estaAtiva()) {
      throw new MyCustomError(
        'Não é possível associar o produto a uma categoria desativada',
      );
    }

    const nomeJaExiste =
      await this.productRepository.findByName(
        input.nome,
        //input.produtoId,
      );

    if (nomeJaExiste && nomeJaExiste.getId() !== input.produtoId) {
      throw new MyCustomError('Já existe outro produto com este nome');
    }

    const preco = Money.create(input.preco, 'AOA');

    produto.alterarDados(
      input.nome,
      input.descricao,
      preco,
    );

    produto.alterarCategoria(input.categoriaId);

    await this.productRepository.save(produto);
  }
}