import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string | null;

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