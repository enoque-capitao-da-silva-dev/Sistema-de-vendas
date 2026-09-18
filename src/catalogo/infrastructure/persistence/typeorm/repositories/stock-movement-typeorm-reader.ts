import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StockMovementReader } from '../../../../application/repositories/stock-movement-reader';
import { TypeOrmRepositoryFactory } from "../transaction/typeorm-repository-factory";
import { StockMovementOrmEntity } from "../entities/stock-movement-orm.entity";
import { StockMovementQuery } from "../../../../application/outputs/stock-movement-query";
import { StockMovementPage } from "../../../../application/outputs/stock-movement-page";
import { StockMovementMapper } from "../mappers/stock-movement.mapper";

@Injectable()
export class StockMovementTypeOrmReader implements StockMovementReader {
  constructor(private readonly repositoryFactory: TypeOrmRepositoryFactory) {}

  private getRepository(): Repository<StockMovementOrmEntity> {
    return this.repositoryFactory.getRepository(StockMovementOrmEntity);
  }

  async findByStockId(
    stockId: string,
    query: StockMovementQuery,
  ): Promise<StockMovementPage> {
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

    return {
      items: entities.map(entity => StockMovementMapper.toDomain(entity)),
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    };
  }
}
