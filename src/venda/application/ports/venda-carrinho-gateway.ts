import { CreateSaleInput } from "../inputs/create-sale.input";

export interface VendaCarrinhoGateway {
  finalizarCompra(input: CreateSaleInput): Promise<void>;
}

export const VENDA_CARRINHO_GATEWAY = Symbol('VENDA_CARRINHO_GATEWAY');