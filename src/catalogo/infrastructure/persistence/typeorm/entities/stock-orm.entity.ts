import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity('stocks')
export class StockOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'product_id',
    unique: true,
  })
  produtoId: string;

  @Column({
    type: 'integer',
    name: 'quantity_available',
  })
  quantidadeDisponivel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
