import { Injectable, Inject } from "@nestjs/common";
import type { ProductRepository } from "../repositories/product.repository";
import { PRODUCT_REPOSITORY } from "../repositories/product.repository";
import { SellableProduct } from "./sellable-product";
import { CatalogoProductReader } from "./catalogo-product-reader";


@Injectable()
export class CatalogoProductReaderImpl implements CatalogoProductReader {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository
  ) {}

  async findSellableProducts(productIds: string[]): Promise<SellableProduct[]> {
    if (productIds.length === 0) {
      return [];
    }

    const products = await this.productRepository.findSellableByIds(productIds);

    return products.map((product) => ({
      id: product.getId(),
      nome: product.getNome(),
      preco: product.getPreco(),
    }));
  }
}
