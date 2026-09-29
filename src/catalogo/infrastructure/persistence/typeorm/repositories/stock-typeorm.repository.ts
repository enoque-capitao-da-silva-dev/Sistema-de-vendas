import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StockRepository } from '../../../../application/repositories/stock.repository';
import { TypeOrmRepositoryFactory } from '../transaction/typeorm-repository-factory';
import { StockMapper } from '../mappers/stock.mapper';
import { StockMovementMapper } from '../mappers/stock-movement.mapper';
import { StockOrmEntity } from '../entities/stock-orm.entity';
import { StockMovementOrmEntity } from '../entities/stock-movement-orm.entity';
import { Estoque } from '../../../../domain/entities/estoque.entity';

@Injectable()
export class StockTypeOrmRepository implements StockRepository {
  constructor(
    @InjectRepository(StockOrmEntity)
    private readonly repository: Repository<StockOrmEntity>,
    private readonly repositoryFactory: TypeOrmRepositoryFactory,
  ) {}

  private getRepository(): Repository<StockOrmEntity> {
    return this.repositoryFactory.getRepository(StockOrmEntity);
  }

  private getMovementRepository(): Repository<StockMovementOrmEntity> {
    return this.repositoryFactory.getRepository(StockMovementOrmEntity);
  }

  async save(estoque: Estoque): Promise<void> {
    const stockRepository = this.getRepository();

    const movementRepository = this.getMovementRepository();

    const stockEntity = StockMapper.toPersistence(estoque);

    await stockRepository.save(stockEntity);

    const movements = estoque.getPendingMovements();

    if (movements.length === 0) {
      return;
    }

    const movementEntities = movements.map(StockMovementMapper.toPersistence);

    await movementRepository.save(movementEntities);
  }

  async saveMany(stocks: Estoque[]): Promise<void> {
    if (stocks.length === 0) {
      return;
    }

    const repository = this.getRepository();

    const ids = stocks.map((stock) => stock.getId());

    const caseParts: string[] = [];
    const parameters: unknown[] = [];

    for (const stock of stocks) {
      caseParts.push(`WHEN ? THEN ?`);

      parameters.push(stock.getId(), stock.getQuantidadeDisponivel());
    }

    const placeholders = ids.map(() => '?').join(', ');

    parameters.push(...ids);

    await repository.query(
      `
      UPDATE stocks
      SET quantity_available =
        CASE id
          ${caseParts.join('\n')}
        END
      WHERE id IN (${placeholders})
    `,
      parameters,
    );

    /*
     * 2. Inserir movimentos
     */

    const movementPlaceholders: string[] = [];
    const movementParameters: unknown[] = [];

    for (const stock of stocks) {
      for (const movement of stock.getPendingMovements()) {
        movementPlaceholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        movementParameters.push(
          movement.getId(),
          stock.getId(),
          movement.getQuantidade(),
          movement.getQuantidadeAnterior(),
          movement.getQuantidadePosterior(),
          movement.getTipo(),
          movement.getOrigem(),
          movement.getReferenciaId(),
          movement.getMotivo(),
          movement.getCreatedAt(),
        );
      }
    }

    if (movementPlaceholders.length === 0) {
      return;
    }

    await repository.query(
      `
        INSERT INTO stock_movements
        (
          id,
          stock_id,
          quantidade,
          quantity_before,
          quantity_after,
          tipo,
          origem,
          reference_id,
          motivo,
          createdAt
        )
        VALUES
        ${movementPlaceholders.join(',\n')}
      `,
      movementParameters,
    );
  }

  async findByProductId(produtoId: string): Promise<Estoque | null> {
    const entity = await this.getRepository().findOne({
      where: { produtoId },
    });

    if (!entity) {
      return null;
    }

    return StockMapper.toDomain(entity);
  }

  async findByProductIds(produtoIds: string[]): Promise<Estoque[] | null> {
    if (produtoIds.length === 0) {
      return [];
    }
    const entities = await this.getRepository().find({
      where: { produtoId: In(produtoIds) },
    });

    if (!entities) {
      return null;
    }

    return entities.map((entity) => StockMapper.toDomain(entity));
  }

  async findByProductIdsForUpdate(productIds: string[]): Promise<Estoque[]> {
    if (productIds.length === 0) {
      return [];
    }

    const repository = this.getRepository();

    const entities = await repository
      .createQueryBuilder('stock')
      .where('stock.produtoId IN (:...productIds)', { productIds })
      .orderBy('stock.id', 'ASC')
      .setLock('pessimistic_write')
      .getMany();

    return entities.map((entity) => StockMapper.toDomain(entity));
  }
}
