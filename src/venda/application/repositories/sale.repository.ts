import { Venda } from "../../domain/entities/venda.entity";
import { GetSaleQuery } from "../inputs/get-sale-query";
import { GetSalePage } from "../outputs/get-sale-page";

export interface SaleRepository {
  save(sale: Venda): Promise<void>;

  findById(id: string): Promise<Venda | null>;
  
  findAll(query: GetSaleQuery): Promise<GetSalePage>;
}

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');
