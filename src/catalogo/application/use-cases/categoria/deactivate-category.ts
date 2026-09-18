import { Injectable, Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";
import type { CategoryRepository } from "../../repositories/category.repository";
import { DeactivateCategoryInput } from "../../inputs/deactivate-category.input";
import { CategoryNotFoundError } from "../../errors/category-not-found.error";

@Injectable()
export class DeactivateCategory {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: DeactivateCategoryInput,
  ): Promise<void> {
    const categoria =
      await this.categoryRepository.findById(input.id);

    if (!categoria) {
      //throw new Error('Categoria não encontrada');
      throw new CategoryNotFoundError();
    }

    categoria.desativar();

    await this.categoryRepository.save(categoria);
  }
}