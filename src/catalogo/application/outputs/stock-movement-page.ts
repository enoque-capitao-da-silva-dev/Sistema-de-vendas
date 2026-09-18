//import { StockMovementOutput } from "./stock-movement.output";
import { MovimentacaoEstoque } from "../../domain/entities/movimentacao-estoque.entity";

export interface StockMovementPage {
  items: MovimentacaoEstoque[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}