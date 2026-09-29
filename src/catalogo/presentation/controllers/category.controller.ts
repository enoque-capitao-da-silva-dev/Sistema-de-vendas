import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { DeactivateCategoryDto } from '../dtos/deactivate-category.dto';
import { CreateCategory } from '../../application/use-cases/categoria/create-category';
import { UpdateCategory } from '../../application/use-cases/categoria/update-category';
import { DeactivateCategory } from '../../application/use-cases/categoria/deactivate-category';
import { CategoryStatus } from '../../domain/enums/category-status.enum';
import { CategoryNotFoundError } from '../../application/errors/category-not-found.error';
import { ReactivateCategory } from '../../application/use-cases/categoria/reactivate-category';
import { GetCategory } from '../../application/use-cases/categoria/get-category';
import { ListCategories } from '../../application/use-cases/categoria/list-categories';
import { ListCategoryDto } from '../dtos/list-category.dto';
import { IdParamDto } from '../dtos/id-param.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategory: CreateCategory,
    private readonly updateCategory: UpdateCategory,
    private readonly getCategory: GetCategory,
    private readonly deactivateCategory: DeactivateCategory,
    private readonly reactivateCategory: ReactivateCategory,
    private readonly listCategories: ListCategories,
  ) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const categoryId = await this.createCategory.execute({
      nome: dto.nome,
      descricao: dto.descricao,
    });

    return {
      id: categoryId,
    };
  }
  
  @Patch(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() dto: CreateCategoryDto
  ) {
    const categoryId = await this.updateCategory.execute({
      id: params.id,
      nome: dto.nome,
      descricao: dto.descricao,
    });

    return {
      id: categoryId,
    };
  }

  @Get(':id')
  async findById(@Param() params: IdParamDto) {
    return this.getCategory.execute({
      id: params.id,
    });
  }
  
  @Get(':status/all')
  async findAll(@Param() params: ListCategoryDto) {
    return this.listCategories.execute({
      status: params.status as CategoryStatus,
    });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param() params: IdParamDto) {
    await this.deactivateCategory.execute({
      id: params.id,
    });

    return {
      message: 'Categoria desativada com sucesso'
    }
  }

  @Patch(':id/reactivate')
  async reactivate(@Param() params: IdParamDto) {
    await this.reactivateCategory.execute({
      id: params.id,
    });
    
    return {
      message: 'Categoria reativada com sucesso'
    }
  }
}
