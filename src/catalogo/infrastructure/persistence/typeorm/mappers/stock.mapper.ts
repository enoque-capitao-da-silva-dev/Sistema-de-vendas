import { StockOrmEntity } from "../entities/stock-orm.entity";
import { Estoque } from "../../../../domain/entities/estoque.entity";

export class StockMapper {
  static toPersistence(estoque: Estoque): StockOrmEntity {
    const entity = new StockOrmEntity();

    entity.id = estoque.getId();
    entity.produtoId = estoque.getProdutoId();

    entity.quantidadeDisponivel = estoque.getQuantidadeDisponivel();

    entity.createdAt = estoque.getCreatedAt();

    entity.updatedAt = estoque.getUpdatedAt();

    return entity;
  }

  static toDomain(entity: StockOrmEntity): Estoque {
    return Estoque.restore({
      id: entity.id,
      produtoId: entity.produtoId,
      quantidadeDisponivel: entity.quantidadeDisponivel,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
