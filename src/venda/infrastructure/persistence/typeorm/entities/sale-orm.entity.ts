import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sales')
export class SaleOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'session_id',
  })
  sessaoCaixaId: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'total_amount',
  })
  totalAmount: string;

  @Column({
    type: 'varchar',
    length: 3,
  })
  currency: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}