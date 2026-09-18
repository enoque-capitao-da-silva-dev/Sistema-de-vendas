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
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ListProductsQueryDto } from '../dtos/list-products-query.dto';
import { IdParamDto } from '../dtos/id-param.dto';
import { RegisterAcquisitionDto } from '../dtos/register-acquisition.dto';

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
      id: productId,
    };
  }

  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() dto: UpdateProductDto,
  ): Promise<void> {
    await this.updateProduct.execute({
      produtoId: params.id,
      categoriaId: dto.categoriaId,
      nome: dto.nome,
      descricao: dto.descricao,
      preco: dto.preco,
    });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param() params: IdParamDto): Promise<void> {
    await this.deactivateProduct.execute({
      produtoId: params.id,
    });
  }

  @Patch(':id/reactivate')
  async reactivate(@Param() params: IdParamDto): Promise<void> {
    await this.reactivateProduct.execute({
      produtoId: params.id,
    });
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
  ): Promise<void> {
    await this.registerAcquisition.execute({
      productId: params.id,
      quantity: dto.quantity,
      referenceId: dto.referenceId,
      reason: dto.reason,
    });
  }
}

/*
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProduct,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateProductDto,
  ) {
    return this.createProduct.execute({
      categoriaId: dto.categoriaId,
      nome: dto.nome,
      descricao: dto.descricao,
      preco: dto.preco,
      currency: dto.currency,
      estoqueInicial: dto.estoqueInicial
    });
  }
}
*/
