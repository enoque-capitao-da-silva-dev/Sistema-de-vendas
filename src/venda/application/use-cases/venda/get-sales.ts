import { Injectable, Inject } from "@nestjs/common";
import { GetSaleQuery } from "../../inputs/get-sale-query";
import { GetSalePage } from "../../outputs/get-sale-page";
import type { SaleRepository } from '../../repositories/sale.repository';
import { SALE_REPOSITORY } from '../../repositories/sale.repository';

@Injectable()
export class GetSales {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(input: GetSaleQuery): Promise<GetSalePage> {
    this.validate(input);
    
    return this.saleRepository.findAll(input);
  }

  private validate(input: GetSaleQuery): void {
    if (!Number.isInteger(input.page) || input.page < 1) {
      throw new Error('A página deve ser um inteiro maior que zero');
    }

    if (!Number.isInteger(input.limit) || input.limit < 1) {
      throw new Error('O limite deve ser um inteiro maior que zero');
    }
  }
}