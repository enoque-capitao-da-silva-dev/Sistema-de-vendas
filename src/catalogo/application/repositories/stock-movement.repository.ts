import { MovimentacaoEstoque } from "../../domain/entities/movimentacao-estoque.entity";

export interface StockMovementRepository {
  save(
    movement: MovimentacaoEstoque,
  ): Promise<void>;
}

export const STOCK_MOVEMENT_REPOSITORY = Symbol('STOCK_MOVEMENT_REPOSITORY');