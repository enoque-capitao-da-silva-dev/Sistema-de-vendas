import { CategoryRepository } from "../../repositories/category.repository";
import { UpdateCategoryInput } from "../../inputs/update-category.input";
import { CreateCategoryOutput } from "../../outputs/create-category.output";
import { CategoryNotFoundError } from "../../errors/category-not-found.error";
import { CategoryAlreadyExistsError } from "../../errors/category-already-exists.error";

export class UpdateCategory {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    input: UpdateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    const categoria =
      await this.categoryRepository.findById(input.id);

    if (!categoria) {
      //throw new Error('Categoria não encontrada');
      throw new CategoryNotFoundError();
    }

    const nomeExiste =
      await this.categoryRepository.existsByName(
        input.nome.trim(),
      );

    if (
      nomeExiste &&
      categoria.getNome() !== input.nome.trim()
    ) {
      /*throw new Error(
        'Já existe uma categoria com esse nome',
      );*/
      throw new CategoryAlreadyExistsError();
    }

    categoria.alterarDados(
      input.nome,
      input.descricao ?? null,
    );

    await this.categoryRepository.save(categoria);

    return {
      id: categoria.getId(),
      nome: categoria.getNome(),
      descricao: categoria.getDescricao(),
      status: categoria.getStatus(),
    };
  }
}