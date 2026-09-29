import { Injectable } from '@nestjs/common';
import { VendaCarrinhoGateway } from './venda-carrinho-gateway';
import { CreateSaleInput } from '../inputs/create-sale.input';
import { CreateSale } from "../use-cases/venda/create-sale";

@Injectable()
export class VendaCarrinhoGatewayImpl implements VendaCarrinhoGateway {
  constructor(private readonly createSale: CreateSale) {}
  
  async finalizarCompra(input: CreateSaleInput): Promise<void> {
    await this.createSale.execute(input);
  }
}
