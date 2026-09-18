import { ProductOrmEntity } from "../entities/product-orm.entity";
import { Produto } from "../../../../domain/entities/produto.entity";
import { Money } from "../../../../domain/shared/money";
import { ProductStatus } from "../../../../domain/enums/product-status.enum";

export class ProductMapper {
  static toPersistence(produto: Produto): ProductOrmEntity {
    const entity = new ProductOrmEntity();

    entity.id = produto.getId();
    entity.categoriaId = produto.getCategoriaId();
    entity.nome = produto.getNome();
    entity.descricao = produto.getDescricao();

    entity.preco = produto.getPreco().getAmount();
    entity.currency = produto.getPreco().getCurrency();

    entity.status = produto.getStatus();

    entity.createdAt = produto.getCreatedAt();
    entity.updatedAt = produto.getUpdatedAt();

    return entity;
  }

  static toDomain(entity: ProductOrmEntity): Produto {
    return Produto.restore({
      id: entity.id,
      categoriaId: entity.categoriaId,
      nome: entity.nome,
      descricao: entity.descricao,
      preco: Money.create(Number(entity.preco), entity.currency),
      status: entity.status as ProductStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
