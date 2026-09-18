import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'sua_senha',
  database: 'sistema_vendas',

  entities: ['src/**/*.entity{.ts,.js}'],

  migrations: ['src/database/migrations/*{.ts,.js}'],
});
