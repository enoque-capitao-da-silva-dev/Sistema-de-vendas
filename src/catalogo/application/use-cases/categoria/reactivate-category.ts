import { Injectable, Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";
import type { CategoryRepository } from "../../repositories/category.repository";
import { CategoryNotFoundError } from "../../errors/category-not-found.error";

@Injectable()
export class ReactivateCategory {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: { id: string },
  ): Promise<void> {
    const categoria =
      await this.categoryRepository.findById(input.id);

    if (!categoria) {
      //throw new Error('Categoria não encontrada');
      throw new CategoryNotFoundError();
    }

    categoria.reativar();

    await this.categoryRepository.save(categoria);
  }
}