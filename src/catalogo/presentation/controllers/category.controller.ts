import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { DeactivateCategoryDto } from '../dtos/deactivate-category.dto';
import { CreateCategory } from '../../application/use-cases/categoria/create-category';
import { DeactivateCategory } from '../../application/use-cases/categoria/deactivate-category';

//import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

//import { CreateCategory } from '../../application/use-cases/create-category';

//import { DeactivateCategory } from '../../application/use-cases/deactivate-category';

import { ReactivateCategory } from '../../application/use-cases/categoria/reactivate-category';

import { GetCategory } from '../../application/use-cases/categoria/get-category';

//import { CreateCategoryDto } from './dto/create-category.dto';

import { CategoryIdParamDto } from '../dtos/category-id-param.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategory: CreateCategory,

    private readonly getCategory: GetCategory,

    private readonly deactivateCategory: DeactivateCategory,

    private readonly reactivateCategory: ReactivateCategory,
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

  @Get(':id')
  async findById(@Param() params: CategoryIdParamDto) {
    return this.getCategory.execute({
      id: params.id,
    });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param() params: CategoryIdParamDto): Promise<void> {
    await this.deactivateCategory.execute({
      id: params.id,
    });
  }

  @Patch(':id/reactivate')
  async reactivate(@Param() params: CategoryIdParamDto): Promise<void> {
    await this.reactivateCategory.execute({
      id: params.id,
    });
  }
}

/*@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategory: CreateCategory,
    private readonly deactivateCategory: DeactivateCategory
  ) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.createCategory.execute({
      nome: dto.nome,
      descricao: dto.descricao,
    });
  }

  @Get('deactivate/:id')
  async deactivate(@Param() dto: DeactivateCategoryDto) {
    this.deactivateCategory.execute(dto);
  }
}
*/
