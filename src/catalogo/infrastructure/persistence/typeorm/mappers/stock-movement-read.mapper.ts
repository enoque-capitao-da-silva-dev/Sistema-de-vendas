import { StockMovementOutput } from "../../../../application/outputs/stock-movement.output";
import { MovimentacaoEstoque } from "../../../../domain/entities/movimentacao-estoque.entity";
import { StockMovementOrmEntity } from "../entities/stock-movement-orm.entity";
import { StockMovementOrigin } from "../../../../domain/enums/stock-movement-origin.enum";
import { StockMovementType } from "../../../../domain/enums/stock-movement-type.enum";

export class StockMovementReadMapper {
  static toView(entity: MovimentacaoEstoque): StockMovementOutput {
    return {
      id: entity.getId(),
      estoqueId: entity.getEstoqueId(),
      tipo: entity.getTipo(),
      origem: entity.getOrigem(),
      quantidade: entity.getQuantidade(),
      quantidadeAnterior: entity.getQuantidadeAnterior(),
      quantidadePosterior: entity.getQuantidadePosterior(),
      referenciaId: entity.getReferenciaId(),
      motivo: entity.getMotivo(),
      createdAt: entity.getCreatedAt(),
    };
  }
}
