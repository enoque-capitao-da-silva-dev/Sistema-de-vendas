import { ProductRepository } from "../../repositories/product.repository";
import { CategoryRepository } from "../../repositories/category.repository";
import { UpdateProductInput } from "../../inputs/update-product.input";
import { Money } from "../../../domain/shared/money";


export class UpdateProduct {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: UpdateProductInput): Promise<void> {
    const produto = await this.productRepository.findById(
      input.produtoId,
    );

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const categoria = await this.categoryRepository.findById(
      input.categoriaId,
    );

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    if (!categoria.estaAtiva()) {
      throw new Error(
        'Não é possível associar o produto a uma categoria desativada',
      );
    }

    const nomeJaExiste =
      await this.productRepository.existsByName(
        input.nome,
        input.produtoId,
      );

    if (nomeJaExiste) {
      throw new Error('Já existe outro produto com este nome');
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