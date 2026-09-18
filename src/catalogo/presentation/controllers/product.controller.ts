import { Controller, Post, Body } from "@nestjs/common";
import type { CreateProductDto } from "../dtos/create-product.dto";
import { CreateProduct } from "../../application/use-cases/produto/create-product";

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