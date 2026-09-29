import { Pagamento } from '../../../../domain/entities/pagamento.entity';
import { PaymentOrmEntity } from '../entities/payment-orm.entity';
import { PaymentMethod } from '../../../../domain/enums/payment-method.enum';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
//import { MoneyMapper } from './money.mapper';
import { Money } from 'src/catalogo/domain/shared/money';

export class PaymentMapper {
  static toPersistence(payment: Pagamento): PaymentOrmEntity {
    return {
      id: payment.getId(),

      vendaId: payment.getVendaId(),

      amount: payment.getValor().getAmount().toFixed(2),

      currency: payment.getValor().getCurrency(),

      method: payment.getMetodo(),

      status: payment.getStatus(),

      createdAt: payment.getCreatedAt(),

      updatedAt: payment.getUpdatedAt(),
    };
  }

  static toDomain(entity: PaymentOrmEntity): Pagamento {
    return Pagamento.restore({
      id: entity.id,

      vendaId: entity.vendaId,

      valor: Money.create(Number(entity.amount), entity.currency),

      metodo: entity.method as PaymentMethod,

      status: entity.status as PaymentStatus,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }
}
