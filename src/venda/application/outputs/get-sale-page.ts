import { Venda } from "../../domain/entities/venda.entity";

export interface GetSalePage {
  items: Venda[],
  page: number,
  limit: number,
  total: number
}