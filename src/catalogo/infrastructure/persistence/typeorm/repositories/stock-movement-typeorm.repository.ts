import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovementRepository } from '../../../../application/repositories/stock-movement.repository';
import { MovimentacaoEstoque } from '../../../..//domain/entities/movimentacao-estoque.entity';
import { StockMovementPage } from '../../../../application/outputs/stock-movement-page';
import { StockMovementQuery } from '../../../../application/outputs/stock-movement-query';
import { StockMovementOrmEntity } from '../entities/stock-movement-orm.entity';
import { TypeOrmRepositoryFactory } from '../transaction/typeorm-repository-factory';
import { StockMovementMapper } from '../mappers/stock-movement.mapper';

export class StockMovementTypeOrmRepository implements StockMovementRepository {
  constructor(
    @InjectRepository(StockMovementOrmEntity)
    private readonly repository: Repository<StockMovementOrmEntity>,

    private readonly repositoryFactory: TypeOrmRepositoryFactory,
  ) {}

  private getRepository(): Repository<StockMovementOrmEntity> {
    /*const context = this.contextStorage.get();

    if (context) {
      return context.manager.getRepository(StockMovementOrmEntity);
    }*/

    return this.repositoryFactory.getRepository(StockMovementOrmEntity);
  }

  async save(movimento: MovimentacaoEstoque): Promise<void> {
    const entity = StockMovementMapper.toPersistence(movimento);

    await this.getRepository().save(entity);
  }

  async findByStockId(stockId: string, query: StockMovementQuery): Promise<StockMovementPage> {
    const repository = this.getRepository();

    const qb = repository
      .createQueryBuilder('movement')
      .where('movement.estoqueId = :stockId', { stockId });

    if (query.tipo) {
      qb.andWhere('movement.tipo = :tipo', {
        tipo: query.tipo,
      });
    }

    if (query.origem) {
      qb.andWhere('movement.origem = :origem', {
        origem: query.origem,
      });
    }

    if (query.from) {
      qb.andWhere('movement.createdAt >= :from', {
        from: query.from,
      });
    }

    if (query.to) {
      qb.andWhere('movement.createdAt <= :to', {
        to: query.to,
      });
    }

    qb.orderBy('movement.createdAt', 'DESC');

    qb.addOrderBy('movement.id', 'DESC');

    const skip = (query.page - 1) * query.limit;

    qb.skip(skip);
    qb.take(query.limit);

    const [entities, total] = await qb.getManyAndCount();
    entities.map(entity => StockMovementMapper.toDomain(entity));
      
    return {
      items: entities.map(entity => StockMovementMapper.toDomain(entity)),
      //items: [],
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    };
  }
}
