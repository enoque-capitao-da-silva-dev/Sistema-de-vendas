import { Injectable, Inject } from "@nestjs/common";
import { ListStockMovementsInput } from "../../inputs/list-stock-movements.input";
import { StockMovementPageOutput } from "../../outputs/stock-movement-page.output";
//import { StockRepository } from "../../repositories/stock.repository";
//import { StockMovementReader } from "../../repositories/stock-movement-reader";
import { StockMovementReadMapper } from "../../../infrastructure/persistence/typeorm/mappers/stock-movement-read.mapper";
import type { StockRepository } from "../../repositories/stock.repository";
import { STOCK_REPOSITORY } from "../../repositories/stock.repository";
import type { StockMovementReader } from "../../repositories/stock-movement-reader";
import { STOCK_MOVEMENT_READER } from "../../repositories/stock-movement-reader";

@Injectable()
export class ListStockMovements {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: StockRepository,
    @Inject(STOCK_MOVEMENT_READER)
    private readonly stockMovementReader: StockMovementReader,
  ) {}

  async execute(
    input: ListStockMovementsInput,
  ): Promise<StockMovementPageOutput> {
    this.validate(input);

    const stock = await this.stockRepository.findByProductId(input.productId);

    if (!stock) {
      throw new Error('Estoque do produto não encontrado');
    }

    const page = await this.stockMovementReader.findByStockId(stock.getId(), {
      page: input.page,
      limit: input.limit,
      tipo: input.tipo,
      origem: input.origem,
      from: input.from,
      to: input.to,
    });

    return {
      items: page.items.map(entity => StockMovementReadMapper.toView(entity)),
      page: page.page,
      limit: page.limit,
      total: page.total,
    };
  }

  private validate(input: ListStockMovementsInput): void {
    if (!input.productId?.trim()) {
      throw new Error('O ID do produto é obrigatório');
    }

    if (!Number.isInteger(input.page) || input.page < 1) {
      throw new Error('A página deve ser maior que zero');
    }

    if (
      !Number.isInteger(input.limit) ||
      input.limit < 1 ||
      input.limit > 100
    ) {
      throw new Error('O limite deve estar entre 1 e 100');
    }

    if (input.from && input.to && input.from > input.to) {
      throw new Error('A data inicial não pode ser posterior à data final');
    }
  }
}
