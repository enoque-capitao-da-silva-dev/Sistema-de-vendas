import { Injectable, Inject } from "@nestjs/common";
import type { StockRepository } from "../../repositories/stock.repository";
import { STOCK_REPOSITORY } from "../../repositories/stock.repository";
import { GetStockInput } from "../../inputs/get-stock.input";
import { GetStockOutput } from "../../outputs/get-stock.output";
import { MyCustomError } from "../../../errors/my-custom.error";

@Injectable()
export class GetStock {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: StockRepository,
  ) {}

  async execute(
    input: GetStockInput,
  ): Promise<GetStockOutput> {
    const estoque =
      await this.stockRepository.findByProductId(
        input.produtoId,
      );

    if (!estoque) {
      throw new MyCustomError('Estoque não encontrado');
    }

    return {
      produtoId: estoque.getProdutoId(),
      quantidadeDisponivel: estoque.getQuantidadeDisponivel(),
    };
  }
}