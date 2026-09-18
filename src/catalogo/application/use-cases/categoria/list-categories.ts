import { CategoryRepository } from "../../repositories/category.repository";
import { CreateCategoryOutput } from "../../outputs/create-category.output";
import { ListCategoriesInput } from "../../inputs/list-categories.input";


export class ListCategories {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: ListCategoriesInput
  ): Promise<CreateCategoryOutput[]> {
    const categorias =
      await this.categoryRepository.findAll(
        input.status,
      );

    return categorias.map((categoria) => ({
      id: categoria.getId(),
      nome: categoria.getNome(),
      descricao: categoria.getDescricao(),
      status: categoria.getStatus(),
    }));
  }
}