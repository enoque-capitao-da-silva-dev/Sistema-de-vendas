import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CreateDecreaseStockForSaleIdempotency1789901860025 } from './1789901860025-createDecreaseStockForSaleIdempotency';
import { CreateRestoreStockFromSaleIdempotency1790067460413 } from './1790067460413-createRestoreStockFromSaleIdempotency';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'sistema_vendas',

  entities: [
    //'src/catalogo/infrastructure/persistence/typeorm/entities/*{.ts,.js}',
    'src/venda/infrastructure/persistence/typeorm/entities/*.entity.ts',
  ],

  migrations: [
    CreateDecreaseStockForSaleIdempotency1789901860025,
    CreateRestoreStockFromSaleIdempotency1790067460413,
    //__dirname+ '../persistence/typeorm/entities/*.ts',
    //'src/catalogo/infrastructure/migrations/persistence/typeorm/entities/*{.ts,.js}',
    'src/venda/infrastructure/migrations/*.ts',
  ],
});

/*

*/

/*
# Gerar
npx typeorm-ts-node-commonjs migration:generate src/catalogo/infrastructure/migrations/createRestoreStockFromSaleIdempotency -d src/catalogo/infrastructure/migrations/data-source.ts

# Criar nova vazia
npx typeorm-ts-node-commonjs migration:create src/catalogo/infrastructure/migrations/createRestoreStockFromSaleIdempotency

# Executar
npx typeorm-ts-node-commonjs migration:run -d src/catalogo/infrastructure/migrations/data-source.ts

# Desfazer a última
npx typeorm-ts-node-commonjs migration:revert -d src/catalogo/infrastructure/migrations/data-source.ts
*/