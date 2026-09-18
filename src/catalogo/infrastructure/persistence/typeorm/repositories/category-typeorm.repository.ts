import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from "../../../../application/repositories/category.repository";
import { CategoryOrmEntity } from "../entities/category-orm.entity";
import { CategoryMapper } from "../mappers/category.mapper";
import { Categoria } from "../../../../domain/entities/categoria.entity";
import { CategoryStatus } from "../../../../domain/enums/category-status.enum";

@Injectable()
export class CategoryTypeOrmRepository
  implements CategoryRepository
{
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {}

  async save(categoria: Categoria): Promise<void> {
    const entity = CategoryMapper.toPersistence(categoria);

    await this.repository.save(entity);
  }

  async findById(
    id: string,
  ): Promise<Categoria | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return CategoryMapper.toDomain(entity);
  }

  async findByName(
    nome: string,
  ): Promise<Categoria | null> {
    const entity = await this.repository.findOne({
      where: { nome },
    });

    if (!entity) {
      return null;
    }

    return CategoryMapper.toDomain(entity);
  }

  async existsByName(
    nome: string,
    categoriaId?: string
  ): Promise<boolean> {
    return this.repository.exists({
      where: { nome },
    });
  }

  async findAll(status: CategoryStatus): Promise<Categoria[]> {
    const categorias = await this.repository.findBy({
        status: status
    });

    return categorias.map(categoria => CategoryMapper.toDomain(categoria))
  }
}