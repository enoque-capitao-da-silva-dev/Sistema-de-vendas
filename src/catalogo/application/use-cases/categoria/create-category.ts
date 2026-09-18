import { Injectable, Inject } from '@nestjs/common';
import type { IdGenerator } from "../../../domain/shared/id-generator";
import { ID_GENERATOR } from "../../../domain/shared/id-generator";
import type { CategoryRepository } from "../../repositories/category.repository";
import { CATEGORY_REPOSITORY } from "../../repositories/category.repository";
import { CreateCategoryInput } from "../../inputs/create-category.input";
import { CreateCategoryOutput } from "../../outputs/create-category.output";
import { Categoria } from "../../../domain/entities/categoria.entity";
import { CategoryAlreadyExistsError } from "../../errors/category-already-exists.error";

@Injectable()
export class CreateCategory {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    input: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {

    const nome = input.nome.trim();

    const exists =
      await this.categoryRepository.existsByName(nome);

    if (exists) {
      /*throw new Error(
        'Já existe uma categoria com esse nome',
      );*/
      throw new CategoryAlreadyExistsError();
    }

    const categoria = Categoria.create(
      //crypto.randomUUID(),
      this.idGenerator.generate(),
      nome,
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