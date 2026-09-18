import { ProductStatus } from '../../../domain/enums/product-status.enum';
import { ListProductsInput } from '../../inputs/list-products.input';
import { ProductPage } from '../../outputs/product-page';
import { ProductQuery } from '../../inputs/product-query';
import { ProductRepository } from '../../repositories/product.repository';

export class ListProducts {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: ListProductsInput): Promise<ProductPage> {
    this.validate(input);

    const query: ProductQuery = {
      page: input.page,
      limit: input.limit,
      nome: input.nome?.trim() || undefined,
      categoriaId: input.categoriaId?.trim() || undefined,
      status: input.status,
    };

    return this.productRepository.findAll(query);
  }

  private validate(input: ListProductsInput): void {
    if (!Number.isInteger(input.page) || input.page < 1) {
      throw new Error('A página deve ser um inteiro maior que zero');
    }

    if (!Number.isInteger(input.limit) || input.limit < 1) {
      throw new Error('O limite deve ser um inteiro maior que zero');
    }
  }
}
