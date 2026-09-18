import { Injectable, Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";
import { GetCategoryInput } from "../../inputs/get-category.input";
import { CreateCategoryOutput } from "../../outputs/create-category.output";
import type { CategoryRepository } from "../../repositories/category.repository";
import { CategoryNotFoundError } from "../../errors/category-not-found.error";

@Injectable()
export class GetCategory {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: GetCategoryInput,
  ): Promise<CreateCategoryOutput> {
    const categoria =
      await this.categoryRepository.findById(input.id);

    if (!categoria) {
      //throw new Error('Categoria não encontrada');
      throw new CategoryNotFoundError();
    }

    return {
      id: categoria.getId(),
      nome: categoria.getNome(),
      descricao: categoria.getDescricao(),
      status: categoria.getStatus(),
    };
  }
}