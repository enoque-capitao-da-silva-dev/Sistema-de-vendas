import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import type { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProduct } from '../../application/use-cases/produto/create-product';
import { UpdateProduct } from '../../application/use-cases/produto/update-product';
import { DeactivateProduct } from '../../application/use-cases/produto/deactivate-product';
import { ReactivateProduct } from '../../application/use-cases/produto/reactivate-product';
import { ListProducts } from '../../application/use-cases/produto/list-products';
import { GetStock } from '../../application/use-cases/estoque/get-stock';
import { RegisterAcquisition } from '../../application/use-cases/estoque/register-acquisition';
import { AdjustStock } from '../../application/use-cases/estoque/adjust-stock';
import { ListStockMovements } from '../../application/use-cases/estoque/list-stock-movements';
import { DecreaseStockForSale } from '../../application/use-cases/estoque/decrease-stock-for-sale';
import { RestoreStockFromSaleCancellation } from '../../application/use-cases/estoque/restore-stock-from-sale-cancellation';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ListProductsQueryDto } from '../dtos/list-products-query.dto';
import { ListStockMovementsQueryDto } from '../dtos/list-stock-movements-query.dto';
import { IdParamDto } from '../dtos/id-param.dto';
import { RegisterAcquisitionDto } from '../dtos/register-acquisition.dto';
import { AdjustStockDto } from '../dtos/adjust-stock.dto';
import { DecreaseStockForSaleDto } from '../dtos/decrease-stock-for-sale.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProduct,
    private readonly updateProduct: UpdateProduct,
    private readonly deactivateProduct: DeactivateProduct,
    private readonly reactivateProduct: ReactivateProduct,
    private readonly listProducts: ListProducts,
    private readonly getStock: GetStock,
    private readonly registerAcquisition: RegisterAcquisition,
    private readonly adjustStock: AdjustStock,
    private readonly listStockMovements: ListStockMovements,
    private readonly decreaseStockForSale: DecreaseStockForSale,
    private readonly restoreStockFromSaleCancellation: RestoreStockFromSaleCancellation,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const productId = await this.createProduct.execute({
      categoriaId: dto.categoriaId,
      nome: dto.nome,
      descricao: dto.descricao,
      preco: dto.preco,
      currency: dto.currency,
      estoqueInicial: dto.estoqueInicial,
    });

    return {
      status: 'success',
      message: 'Produto criado com sucesso'
    };
  }

  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() dto: UpdateProductDto,
  ) {
    await this.updateProduct.execute({
      produtoId: params.id,
      categoriaId: dto.categoriaId,
      nome: dto.nome,
      descricao: dto.descricao,
      preco: dto.preco,
    });

    return {
      status: 'success',
      message: 'Produto atualizado com sucesso',
    }
  }

  @Patch(':id/deactivate')
  async deactivate(@Param() params: IdParamDto) {
    await this.deactivateProduct.execute({
      produtoId: params.id,
    });

    return {
      status: 'success',
      message: 'Produto desativado com sucesso'
    }
  }

  @Patch(':id/reactivate')
  async reactivate(@Param() params: IdParamDto) {
    await this.reactivateProduct.execute({
      produtoId: params.id,
    });

    return {
      status: 'success',
      message: 'Produto reativado com sucesso'
    }
  }

  @Get()
  async findAll(@Query() query: ListProductsQueryDto) {
    return this.listProducts.execute({
      page: query.page,
      limit: query.limit,
      nome: query.nome,
      categoriaId: query.categoriaId,
      status: query.status,
    });
  }

  @Get(':id/stock')
  async findStock(@Param() params: IdParamDto) {
    return this.getStock.execute({
      produtoId: params.id,
    });
  }

  @Post(':id/stock/acquisitions')
  async registerrAcquisition(
    @Param() params: IdParamDto,
    @Body() dto: RegisterAcquisitionDto,
  ) {
    await this.registerAcquisition.execute({
      productId: params.id,
      quantity: dto.quantidade,
      referenceId: dto.referenciaId ?? null,
      reason: dto.motivo ?? null,
    });

    return {
      status: 'success',
      message: 'Aquisição concluida com sucesso',
      data: {
        produtoId: params.id,
      }
    }
  }

  @Post(':id/stock/adjustments')
  async adjusttStock(
    @Param() params: IdParamDto,
    @Body() dto: AdjustStockDto,
  ) {
    await this.adjustStock.execute({
      produtoId: params.id,
      quantidadeReal: dto.quantidadeReal,
      motivo: dto.motivo,
    });

    return {
      status: 'success',
      message: 'Ajuste de estoque concluodo com sucesso',
      data: {
        produtoId: params.id
      }
    }
  }

  @Get(':id/stock/movements')
  async listtStockMovements(
    @Param() params: IdParamDto,
    @Query() query: ListStockMovementsQueryDto,
  ) {
    return this.listStockMovements.execute({
      productId: params.id,
      page: query.page,
      limit: query.limit,
      tipo: query.tipo,
      origem: query.origem,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }

  @Post(':id/stock/decrease-stock-for-sale')
  async decreaseStockForSales(
    @Param() params: IdParamDto,
    @Body() dto: DecreaseStockForSaleDto
  ) {
    await this.decreaseStockForSale.execute({
      saleId: params.id,
      items: dto.items
    });

    return {
      status: 'success',
      message: 'Baixa da venda realizada com sucesso'
    }
  }
  
  @Post(':id/stock/decrease-stock-from-sale-cancellation')
  async restoreStockFromSaleCancellations(
    @Param() params: IdParamDto,
    @Body() dto: DecreaseStockForSaleDto
  ) {
    await this.restoreStockFromSaleCancellation.execute({
      saleId: params.id,
      items: dto.items
    });

    return {
      status: 'success',
      message: 'Estoques restaurados com sucesso'
    }
  }
}