import { CategoryOrmEntity } from '../entities/category-orm.entity';
import { Categoria } from '../../../../domain/entities/categoria.entity';
import { CategoryStatus } from '../../../../domain/enums/category-status.enum';

export class CategoryMapper {
  static toPersistence(categoria: Categoria): CategoryOrmEntity {
    const entity = new CategoryOrmEntity();

    entity.id = categoria.getId();
    entity.nome = categoria.getNome();
    entity.descricao = categoria.getDescricao();
    entity.status = categoria.getStatus();
    entity.createdAt = categoria.getCreatedAt();
    entity.updatedAt = categoria.getUpdatedAt();

    return entity;
  }

  static toDomain(entity: CategoryOrmEntity): Categoria {
    return Categoria.restore({
      id: entity.id,
      nome: entity.nome,
      descricao: entity.descricao,
      status: entity.status as CategoryStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
