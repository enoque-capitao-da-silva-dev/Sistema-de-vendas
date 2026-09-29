import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SaleRepository } from '../../../../application/repositories/sale.repository';
import { GetSaleQuery } from '../../../../application/inputs/get-sale-query';
import { GetSalePage } from '../../../../application/outputs/get-sale-page';
import { Venda } from '../../../../domain/entities/venda.entity';
import { SaleOrmEntity } from '../entities/sale-orm.entity';
import { SaleItemOrmEntity } from '../entities/sale-item-orm.entity';
import { SaleMapper } from '../mappers/sale.mapper';
import { SaleItemMapper } from '../mappers/sale-item.mapper';
import { TypeOrmRepositoryFactory } from 'src/catalogo/infrastructure/persistence/typeorm/transaction/typeorm-repository-factory';

@Injectable()
export class SaleTypeOrmRepository implements SaleRepository {
  constructor(private readonly repositoryFactory: TypeOrmRepositoryFactory) {}

  private getSaleRepository(): Repository<SaleOrmEntity> {
    return this.repositoryFactory.getRepository(SaleOrmEntity);
  }

  private getSaleItemRepository(): Repository<SaleItemOrmEntity> {
    return this.repositoryFactory.getRepository(SaleItemOrmEntity);
  }

  async save(sale: Venda): Promise<void> {
    const saleRepository = this.getSaleRepository();

    const saleItemRepository = this.getSaleItemRepository();

    const saleEntity = SaleMapper.toPersistence(sale);

    const itemEntities = sale
      .getItens()
      .map((item) => SaleItemMapper.toPersistence(item, sale.getId()));

    await saleRepository.save(saleEntity);

    await saleItemRepository.save(itemEntities);
  }

  async findById(id: string): Promise<Venda | null> {
    
    if (!id.trim()) {
      throw new Error('saleId é obrigatório');
    }

    const saleRepository = this.getSaleRepository();
    const saleItemRepository = this.getSaleItemRepository();
    
    const sale = await saleRepository.findOneBy({ id });

    if (!sale) {
      throw new Error(`Não há nenhuma venda com ID: ${id}`);
    }

    const items = await saleItemRepository.findBy({
      vendaId: sale.id
    });

    if (items.length === 0) {
      throw new Error('Items da venda não encontrados');
    }
    
    return SaleMapper.toDomain(sale, items);
  }

  async findAll(query: GetSaleQuery): Promise<GetSalePage> {
    const repository = this.getSaleRepository();

    const qb = repository.createQueryBuilder('sale');

    if (query.sessionId) {
      qb.andWhere('sale.session_id = :sessionId', {
        sessionId: query.sessionId
      });
    }

    if (query.status) {
      qb.andWhere('sale.status = :status', {
        status: query.status
      });
    }

    if (query.from && query.to) {
      qb.andWhere('sale.created_at between :from and :to', {
        from: query.from,
        to: query.to
      });
    }

    if (query.from) {
      qb.andWhere('sale.created_at = :from', {
        from: query.from
      });
    }

    qb.orderBy('sale.created_at', 'DESC');

    qb.skip((query.page - 1) * query.limit);
    qb.take(query.limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map(entity => SaleMapper.toDomain(entity)),
      page: query.page,
      limit: query.limit,
      total
    };
  }
}
