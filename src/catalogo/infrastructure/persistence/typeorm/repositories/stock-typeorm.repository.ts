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
      .setLock('pessimistic_write')
      .getMany();

    return entities.map((entity) => StockMapper.toDomain(entity));
  }

}
