import { StockMovementOutput } from "../../../../application/outputs/stock-movement.output";
import { StockMovementOrmEntity } from "../entities/stock-movement-orm.entity";
import { StockMovementOrigin } from "../../../../domain/enums/stock-movement-origin.enum";
import { StockMovementType } from "../../../../domain/enums/stock-movement-type.enum";

export class StockMovementReadMapper {
  static toView(entity: StockMovementOrmEntity): StockMovementOutput {
    return {
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
    };
  }
}
