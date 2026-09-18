import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'category_id',
  })
  categoriaId: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string | null;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  preco: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}