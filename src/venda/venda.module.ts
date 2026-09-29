import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SaleOrmEntity } from './infrastructure/persistence/typeorm/entities/sale-orm.entity';
import { SaleItemOrmEntity } from './infrastructure/persistence/typeorm/entities/sale-item-orm.entity';
import { SaleTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/sale-typeorm.repository';
import { SALE_REPOSITORY } from './application/repositories/sale.repository';
import { PaymentTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/payment-typeorm.repository';
import { PAYMENT_REPOSITORY } from './application/repositories/payment.repository';
import { PaymentOrmEntity } from './infrastructure/persistence/typeorm/entities/payment-orm.entity';
import { CashSessionReaderImpl } from './application/ports/cash-session-reader-impl';
import { CASH_SESSION_READER } from './application/ports/cash-session-reader';
import { CreateSale } from './application/use-cases/venda/create-sale';
import { CancelSale } from './application/use-cases/venda/cancel-sale';
import { GetSales } from './application/use-cases/venda/get-sales';
import { VendaCarrinhoGatewayImpl } from './application/ports/venda-carrinho-gateway-impl';
import { VENDA_CARRINHO_GATEWAY } from './application/ports/venda-carrinho-gateway';
import { SaleController } from './presentation/controllers/sale.controller';

import { CatalogoModule } from '../catalogo/catalogo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleOrmEntity,
      SaleItemOrmEntity,
      PaymentOrmEntity,
      //DataSource,
    ]),
    CatalogoModule
  ],
  controllers: [SaleController],
  providers: [
    {
      provide: SALE_REPOSITORY,
      useClass: SaleTypeOrmRepository
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentTypeOrmRepository
    },
    {
      provide: CASH_SESSION_READER,
      useClass: CashSessionReaderImpl
    },
    {
      provide: VENDA_CARRINHO_GATEWAY,
      useClass: VendaCarrinhoGatewayImpl
    },
    CreateSale,
    CancelSale,
    GetSales
  ],
  exports: [
    VENDA_CARRINHO_GATEWAY
  ]
})
export class VendaModule {}
