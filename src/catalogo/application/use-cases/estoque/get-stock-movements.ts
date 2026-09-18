import { StockRepository } from '../../repositories/stock.repository';
import { StockMovementReader } from '../../repositories/stock-movement-reader';
import { GetStockMovementsInput } from '../../inputs/get-stock-movements.input';
import { StockMovementPage } from '../../outputs/stock-movement-page';

export class GetStockMovements {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly movementReader: StockMovementReader,
  ) {}

  async execute(input: GetStockMovementsInput): Promise<StockMovementPage> {
    const estoque = await this.stockRepository.findByProductId(input.produtoId);

    if (!estoque) {
      throw new Error('Estoque não encontrado');
    }

    return this.movementReader.findByStockId(estoque.getId(), {
      page: input.page,
      limit: input.limit,
    });
  }
}