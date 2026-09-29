import { SaleItemOrmEntity } from '../entities/sale-item-orm.entity';
import { ItemVenda } from '../../../../domain/entities/item-venda.entity';

export class SaleItemMapper {
  static toPersistence(item: ItemVenda, vendaId: string): SaleItemOrmEntity {
    return {
      id: item.getId(),
      vendaId,
      produtoId: item.getProductId(),
      produtoNome: item.getProductName(),
      precoUnitarioAmount: item.getUnitPrice().getAmount().toFixed(2),
      precoUnitarioCurrency: item.getUnitPrice().getCurrency(),
      quantidade: item.getQuantity(),
      subtotalAmount: item.getSubtotal().getAmount().toFixed(2),
    };
  }

  static toDomain(item: SaleItemOrmEntity): ItemVenda {
    return ItemVenda.restore({
      id: item.id,
      productId: item.produtoId,
      productName: item.produtoNome,
      unitPrice: Number(item.precoUnitarioAmount),
      currency: item.precoUnitarioCurrency,
      quantity: item.quantidade,
      subtotal: Number(item.subtotalAmount)
    });
  }
}
