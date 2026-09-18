import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity('stock_movements')
export class StockMovementOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'stock_id',
  })
  estoqueId: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  tipo: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  origem: string;

  @Column({
    type: 'integer',
  })
  quantidade: number;

  @Column({
    type: 'integer',
    name: 'quantity_before',
  })
  quantidadeAnterior: number;

  @Column({
    type: 'integer',
    name: 'quantity_after',
  })
  quantidadePosterior: number;

  @Column({
    type: 'uuid',
    name: 'reference_id',
    nullable: true,
  })
  referenciaId: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  motivo: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
