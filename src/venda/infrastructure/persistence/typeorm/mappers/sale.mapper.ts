import { SaleOrmEntity } from '../entities/sale-orm.entity';
import { SaleItemOrmEntity } from '../entities/sale-item-orm.entity';
import { Venda } from '../../../../domain/entities/venda.entity';
import { SaleItemMapper } from './sale-item.mapper';

export class SaleMapper {
  static toPersistence(venda: Venda): SaleOrmEntity {
    return {
      id: venda.getId(),
      sessaoCaixaId: venda.getSessaoCaixaId(),
      totalAmount: venda.getTotal().getAmount().toFixed(2),
      currency: venda.getTotal().getCurrency(),
      status: venda.getStatus(),
      createdAt: venda.getCreatedAt(),
      updatedAt: venda.getUpdatedAt(),
    };
  }

  static toDomain(venda: SaleOrmEntity, itemsVenda: SaleItemOrmEntity[] = []): Venda {
    const items = itemsVenda.length > 0 
      ? itemsVenda.map(item => SaleItemMapper.toDomain(item)) 
      : [];
    
    return Venda.restore({
      id: venda.id,
      sessaoCaixaId: venda.sessaoCaixaId,
      items: items,
      total: Number(venda.totalAmount),
      moeda: venda.currency,
      status: venda.status,
      createdAt: venda.createdAt,
      updatedAt: venda.updatedAt
    });
  }
}
