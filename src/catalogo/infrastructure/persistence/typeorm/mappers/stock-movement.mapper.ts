import { MovimentacaoEstoque } from "../../../../domain/entities/movimentacao-estoque.entity";
import { StockMovementOrmEntity } from "../entities/stock-movement-orm.entity";
import { StockMovementOrigin } from '../../../../domain/enums/stock-movement-origin.enum';
import { StockMovementType } from '../../../../domain/enums/stock-movement-type.enum';

export class StockMovementMapper {
  static toPersistence(movimento: MovimentacaoEstoque): StockMovementOrmEntity {
    const entity = new StockMovementOrmEntity();

    entity.id = movimento.getId();

    entity.estoqueId = movimento.getEstoqueId();

    entity.tipo = movimento.getTipo();

    entity.origem = movimento.getOrigem();

    entity.quantidade = movimento.getQuantidade();

    entity.quantidadeAnterior = movimento.getQuantidadeAnterior();

    entity.quantidadePosterior = movimento.getQuantidadePosterior();

    entity.referenciaId = movimento.getReferenciaId();

    entity.motivo = movimento.getMotivo();

    entity.createdAt = movimento.getCreatedAt();

    return entity;
  }

  static toDomain(entity: StockMovementOrmEntity): MovimentacaoEstoque {
    return MovimentacaoEstoque.restore({
      id: entity.id,
      estoqueId: entity.estoqueId,
      tipo: entity.tipo as StockMovementType,
      origem: entity.origem as StockMovementOrigin,
      quantidade: entity.quantidade,
      quantidadeAnterior: entity.quantidadeAnterior,
      quantidadePosterior: entity.quantidadePosterior,
      referenciaId: entity.referenciaId,
      motivo: entity.motivo,
      createdAt: entity.createdAt,
    });
  }
}
