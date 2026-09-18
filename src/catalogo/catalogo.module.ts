import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORY_REPOSITORY } from './application/repositories/category.repository';
import { PRODUCT_REPOSITORY } from './application/repositories/product.repository';
import { STOCK_REPOSITORY } from './application/repositories/stock.repository';
import { STOCK_MOVEMENT_REPOSITORY } from './application/repositories/stock-movement.repository';
import { STOCK_MOVEMENT_READER } from './application/repositories/stock-movement-reader';
import { ID_GENERATOR } from './domain/shared/id-generator';
import { UuidGenerador } from './domain/shared/uuid-generator';
import { SystemClock } from './domain/shared/system-clock';
import { CLOCK } from './domain/shared/clock';
import { CategoryTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/category-typeorm.repository';
import { ProductTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/product-typeorm.repository';
import { StockTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/stock-typeorm.repository';
import { StockMovementTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/stock-movement-typeorm.repository';
import { StockMovementTypeOrmReader } from './infrastructure/persistence/typeorm/repositories/stock-movement-typeorm-reader';
import { TransactionContextService } from './infrastructure/persistence/typeorm/transaction/transaction-context.service';
import { TypeOrmTransactionManager } from './infrastructure/persistence/typeorm/transaction/typeorm-transaction-manager';
import { TypeOrmRepositoryFactory } from './infrastructure/persistence/typeorm/transaction/typeorm-repository-factory';
import { CategoryOrmEntity } from './infrastructure/persistence/typeorm/entities/category-orm.entity';
import { ProductOrmEntity } from './infrastructure/persistence/typeorm/entities/product-orm.entity';
import { StockOrmEntity } from './infrastructure/persistence/typeorm/entities/stock-orm.entity';
import { StockMovementOrmEntity } from './infrastructure/persistence/typeorm/entities/stock-movement-orm.entity';
import { CreateCategory } from './application/use-cases/categoria/create-category';
import { DeactivateCategory } from './application/use-cases/categoria/deactivate-category';
import { ReactivateCategory } from './application/use-cases/categoria/reactivate-category';
import { GetCategory } from './application/use-cases/categoria/get-category';
import { CreateProduct } from './application/use-cases/produto/create-product';
import { UpdateProduct } from './application/use-cases/produto/update-product';
import { DeactivateProduct } from './application/use-cases/produto/deactivate-product';
import { ReactivateProduct } from './application/use-cases/produto/reactivate-product';
import { ListProducts } from './application/use-cases/produto/list-products';
import { GetStock } from './application/use-cases/estoque/get-stock';
import { RegisterAcquisition } from './application/use-cases/estoque/register-acquisition';
import { AdjustStock } from './application/use-cases/estoque/adjust-stock';
import { ListStockMovements } from './application/use-cases/estoque/list-stock-movements';
import { TRANSACTION_MANAGER } from './application/use-cases/shared/transaction-manager';
import { CategoryController } from './presentation/controllers/category.controller';
import { ProductController } from './presentation/controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryOrmEntity,
      ProductOrmEntity,
      StockOrmEntity,
      StockMovementOrmEntity,
      DataSource,
    ]),
  ],
  controllers: [CategoryController, ProductController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductTypeOrmRepository,
    },
    {
      provide: STOCK_REPOSITORY,
      useClass: StockTypeOrmRepository,
    },
    {
      provide: STOCK_MOVEMENT_REPOSITORY,
      useClass: StockMovementTypeOrmRepository,
    },
    {
      provide: STOCK_MOVEMENT_READER,
      useClass: StockMovementTypeOrmReader,
    },
    {
      provide: TRANSACTION_MANAGER,
      useExisting: TypeOrmTransactionManager,
    },
    {
      provide: ID_GENERATOR,
      useClass: UuidGenerador,
    },
    {
      provide: CLOCK,
      useClass: SystemClock,
    },
    CreateCategory,
    GetCategory,
    DeactivateCategory,
    ReactivateCategory,
    //CreateCategory,
    CreateProduct,
    UpdateProduct,
    DeactivateProduct,
    ReactivateProduct,
    ListProducts,
    GetStock,
    RegisterAcquisition,
    AdjustStock,
    ListStockMovements,
    TransactionContextService,
    TypeOrmTransactionManager,
    TypeOrmRepositoryFactory,
    /*ProductTypeOrmRepository,
    StockTypeOrmRepository,
    StockMovementTypeOrmRepository*/
  ],
  exports: [
    //CATEGORY_REPOSITORY
  ],
})
export class CatalogoModule {}
