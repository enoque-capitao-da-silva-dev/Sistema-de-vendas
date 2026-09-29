import { Controller, Get, Post, Body, Put, Query } from '@nestjs/common';
import { CreateSale } from '../../application/use-cases/venda/create-sale';
import { CancelSale } from '../../application/use-cases/venda/cancel-sale';
import { GetSales } from '../../application/use-cases/venda/get-sales';
import { CreateSaleDto } from '../dtos/create-sale.dto';
import { CancelSaleDto } from '../dtos/cancel-sale.dto';
import { GetSalesDto } from '../dtos/get-sales.dto';

@Controller('sales')
export class SaleController {
  constructor(
    private readonly createSale: CreateSale,
    private readonly cancelSale: CancelSale,
    private readonly getSale: GetSales,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateSaleDto
  ) {
    await this.createSale.execute({
      sessaoCaixaId: dto.sessaoCaixaId,
      items: dto.items,
      paymentMethod: dto.paymentMethod
    });
    
    return {
      status: 'success',
      message: 'Venda realizada com sucesso'
    };
  }

  @Put()
  async cancel(@Body() dto: CancelSaleDto) {
    await this.cancelSale.execute({
      saleId: dto.saleId,
      actor: {
        userId: dto.actor.userId,
        role: dto.actor.role
      }   
    });

    return {
      status: 'success',
      message: 'Venda cancelada com sucesso'
    }
  }

  @Get()
  async findAll(
    @Query() query: GetSalesDto) {
    return await this.getSale.execute({
      sessionId: query.sessionId ?? undefined,
      status: query.status ?? undefined,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      page: query.page,
      limit: query.limit
    });
  }
}
