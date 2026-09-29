import { SaleStatus } from "../../domain/enums/sale-status.enum";

export interface GetSaleQuery {
  sessionId?: string,
  status?: SaleStatus,
  from?: Date,
  to?: Date,
  page: number,
  limit: number
}