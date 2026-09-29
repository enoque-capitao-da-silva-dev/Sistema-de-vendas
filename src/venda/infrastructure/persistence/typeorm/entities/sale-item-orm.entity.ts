import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sale_items')
export class SaleItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'sale_id',
  })
  vendaId: string;

  @Column({
    type: 'uuid',
    name: 'product_id',
  })
  produtoId: string;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'product_name',
  })
  produtoNome: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'unit_price_amount',
  })
  precoUnitarioAmount: string;

  @Column({
    type: 'varchar',
    length: 3,
    name: 'unit_price_currency',
  })
  precoUnitarioCurrency: string;

  @Column({
    type: 'integer',
  })
  quantidade: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  subtotalAmount: string;
}
