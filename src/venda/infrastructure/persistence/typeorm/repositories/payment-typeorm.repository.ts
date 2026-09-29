import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaymentRepository } from '../../../../application/repositories/payment.repository';
import { Pagamento } from '../../../../domain/entities/pagamento.entity';
import { PaymentOrmEntity } from '../entities/payment-orm.entity';
import { PaymentMapper } from '../mappers/payment.mapper';
import { TypeOrmRepositoryFactory } from 'src/catalogo/infrastructure/persistence/typeorm/transaction/typeorm-repository-factory';

@Injectable()
export class PaymentTypeOrmRepository implements PaymentRepository {
  constructor(private readonly repositoryFactory: TypeOrmRepositoryFactory) {}

  private getRepository(): Repository<PaymentOrmEntity> {
    return this.repositoryFactory.getRepository(PaymentOrmEntity);
  }

  async save(payment: Pagamento): Promise<void> {
    const entity = PaymentMapper.toPersistence(payment);

    await this.getRepository().save(entity);
  }

  async findBySaleId(saleId: string): Promise<Pagamento | null> {
    const entity = await this.getRepository().findOne({
      where: {
        vendaId: saleId,
      },
    });

    if (!entity) {
      return null;
    }

    return PaymentMapper.toDomain(entity);
  }
}
