import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductOrmEntity } from '../entities/product-orm.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { TransactionContextService } from '../transaction/transaction-context.service';
import { TypeOrmRepositoryFactory } from '../transaction/typeorm-repository-factory';
import { ProductRepository } from '../../../../application/repositories/product.repository';
import { Produto } from '../../../../domain/entities/produto.entity';
import { ProductStatus } from '../../../../domain/enums/product-status.enum';
import { ProductQuery } from '../../../../application/inputs/product-query';
import { ProductPage } from '../../../../application/outputs/product-page';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
    private readonly repositoryFactory: TypeOrmRepositoryFactory,
  ) {}

  async save(produto: Produto): Promise<void> {
    const entity = ProductMapper.toPersistence(produto);

    await this.getRepository().save(entity);
  }

  async findById(id: string): Promise<Produto | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return ProductMapper.toDomain(entity);
  }

  async findByName(nome: string): Promise<Produto | null> {
    const entity = await this.repository.findOne({
      where: { nome },
    });

    if (!entity) {
      return null;
    }

    return ProductMapper.toDomain(entity);
  }

  async findAll(query: ProductQuery): Promise<ProductPage> {
    const repository = this.getRepository();

    const qb = repository.createQueryBuilder('product');

    if (query.nome) {
      qb.andWhere('product.nome LIKE :nome', {
        nome: `%${query.nome}%`,
      });
    }

    if (query.categoriaId) {
      qb.andWhere('product.categoriaId = :categoriaId', {
        categoriaId: query.categoriaId,
      });
    }

    if (query.status) {
      qb.andWhere('product.status = :status', {
        status: query.status,
      });
    }

    qb.orderBy('product.createdAt', 'DESC');

    qb.addOrderBy('product.id', 'DESC');

    qb.skip((query.page - 1) * query.limit);

    qb.take(query.limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map((entity) => ProductMapper.toDomain(entity)),
      page: query.page,
      limit: query.limit,
      total,
    };
  }

  async existsByName(nome: string): Promise<boolean> {
    return this.repository.exists({
      where: { nome },
    });
  }

  async findSellableByIds(productIds: string[]): Promise<Produto[]> {
    if (productIds.length === 0) {
      return [];
    }

    const repository = this.getRepository();

    const entities = await repository.find({
      where: {
        id: In(productIds),
        status: ProductStatus.ATIVO,
      },
    });

    return entities.map(entity => ProductMapper.toDomain(entity));
  }

  private getRepository(): Repository<ProductOrmEntity> {
    return this.repositoryFactory.getRepository(ProductOrmEntity);
  }
}
