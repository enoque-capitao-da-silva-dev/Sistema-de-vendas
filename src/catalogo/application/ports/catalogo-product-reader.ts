import { SellableProduct } from "./sellable-product";

export interface CatalogoProductReader {
  findSellableProducts(
    productIds: string[],
  ): Promise<SellableProduct[]>;
}

export const CATALOGO_PRODUCT_READER = Symbol('CATALOGO_PRODUCT_READER');