import { Injectable, Inject } from "@nestjs/common";
//import { CategoryRepository } from "../../repositories/category.repository";
import { CreateCategoryOutput } from "../../outputs/create-category.output";
import { ListCategoriesInput } from "../../inputs/list-categories.input";
import type { CategoryRepository } from "../../repositories/category.repository";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";

@Injectable()
export class ListCategories {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: ListCategoriesInput
  ): Promise<CreateCategoryOutput[]> {
    const categorias =
      await this.categoryRepository.findAll(
        input.status,
      );

    if (!categorias) {
      return [];
    }

    return categorias.map((categoria) => ({
      id: categoria.getId(),
      nome: categoria.getNome(),
      descricao: categoria.getDescricao(),
      status: categoria.getStatus(),
    }));
  }
}