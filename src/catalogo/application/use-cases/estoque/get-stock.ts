import { StockRepository } from "../../repositories/stock.repository";
import { GetStockInput } from "../../inputs/get-stock.input";
import { GetStockOutput } from "../../outputs/get-stock.output";

export class GetStock {
  constructor(
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
      throw new Error('Estoque não encontrado');
    }

    return {
      produtoId: estoque.getProdutoId(),
      quantidadeDisponivel: estoque.getQuantidadeDisponivel(),
    };
  }
}