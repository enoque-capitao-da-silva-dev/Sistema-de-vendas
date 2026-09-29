import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class PaymentOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'sale_id',
    unique: true,
  })
  vendaId: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: string;

  @Column({
    type: 'varchar',
    length: 3,
  })
  currency: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  method: string;

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
