import { Injectable, Inject } from '@nestjs/common';
import type { CatalogoProductReader } from 'src/catalogo/application/ports/catalogo-product-reader';
import { CATALOGO_PRODUCT_READER } from 'src/catalogo/application/ports/catalogo-product-reader';
import type { CatalogoSalesGateway } from 'src/catalogo/application/ports/catalogo-sales-gateway';
import { CATALOGO_SALES_GATEWAY } from 'src/catalogo/application/ports/catalogo-sales-gateway';
import type { SaleRepository } from '../../repositories/sale.repository';
import { SALE_REPOSITORY } from '../../repositories/sale.repository';
import type { PaymentRepository } from '../../repositories/payment.repository';
import { PAYMENT_REPOSITORY } from '../../repositories/payment.repository';
import { Venda } from '../../../domain/entities/venda.entity';
import { ItemVenda } from '../../../domain/entities/item-venda.entity';
import { Pagamento } from '../../../domain/entities/pagamento.entity';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import { CreateSaleInput } from '../../inputs/create-sale.input';
import { CreateSaleOutput } from '../../outputs/create-sale.output';
import type { IdGenerator } from 'src/catalogo/domain/shared/id-generator';
import { ID_GENERATOR } from 'src/catalogo/domain/shared/id-generator';
import type { Clock } from 'src/catalogo/domain/shared/clock';
import { CLOCK } from 'src/catalogo/domain/shared/clock';
import type { TransactionManager } from 'src/catalogo/application/use-cases/shared/transaction-manager';
import { TRANSACTION_MANAGER } from 'src/catalogo/application/use-cases/shared/transaction-manager';

@Injectable()
export class CreateSale {
  constructor(
    @Inject(CATALOGO_PRODUCT_READER)
    private readonly catalogoProductReader: CatalogoProductReader,
    @Inject(CATALOGO_SALES_GATEWAY)
    private readonly catalogoSalesGateway: CatalogoSalesGateway,
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(input: CreateSaleInput): Promise<CreateSaleOutput> {
    this.validateInput(input);

    const productIds = input.items.map((item) => item.productId);

    //
    // O cliente não informa nome nem preço.
    // O Catálogo fornece esses dados.
    //
    const products =
      await this.catalogoProductReader.findSellableProducts(productIds);

    if (products.length === 0) {
      throw new Error('Produtos não encontrados');
    }

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    //
    // Verifica se todos os produtos solicitados
    // continuam vendáveis.
    //
    for (const productId of productIds) {
      if (!productsById.has(productId)) {
        throw new Error(`Produto não disponível para venda: ${productId}`);
      }
    }

    //
    // Cria os snapshots dos produtos.
    //
    // A partir daqui, a venda não depende mais
    // do nome/preço atual do Produto.
    //
    const saleItems = input.items.map((item) => {
      const product = productsById.get(item.productId)!;

      return ItemVenda.create({
        id: this.idGenerator.generate(),
        productId: product.id,
        productName: product.nome,
        unitPrice: product.preco,
        quantity: item.quantity,
      });
    });

    const saleId = this.idGenerator.generate();
    //const saleId = '25b16535-aa5f-49df-b5cd-9da56c313bdf';

    const createdAt = this.clock.now();

    const sale = Venda.create({
      id: saleId,
      sessaoCaixaId: input.sessaoCaixaId,
      itens: saleItems,
      createdAt,
    });

    const payment = Pagamento.create({
      id: this.idGenerator.generate(),
      vendaId: sale.getId(),
      valor: sale.getTotal(),
      metodo: input.paymentMethod,
      createdAt,
    });

    //
    // A partir daqui começa a operação transacional.
    //
    // O CreateSale é o dono da transação.
    //
    // O Catálogo NÃO abre outra transação.
    //
    await this.transactionManager.run(async () => {
      //
      // Baixa o estoque de todos os produtos.
      //
      // O CatalogoSalesGateway utiliza a transação
      // atual através do TransactionContext.
      //
      await this.catalogoSalesGateway.decreaseStock({
        saleId,

        items: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      //
      // Persiste a Venda e seus itens.
      //
      await this.saleRepository.save(sale);

      await this.paymentRepository.save(payment);
    });

    return {
      saleId,
    };
  }

  private validateInput(input: CreateSaleInput): void {
    if (!input.sessaoCaixaId?.trim()) {
      throw new Error('A sessão do caixa é obrigatória');
    }

    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new Error('A venda deve possuir pelo menos um item');
    }

    const productIds = new Set<string>();

    for (const item of input.items) {
      if (!item.productId?.trim()) {
        throw new Error('O produto é obrigatório');
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error('A quantidade deve ser maior que zero');
      }

      if (productIds.has(item.productId)) {
        throw new Error(`Produto duplicado na venda: ${item.productId}`);
      }

      productIds.add(item.productId);
    }

    this.validatePaymentMethod(input.paymentMethod)
  }

  private validatePaymentMethod(method: PaymentMethod): void {
    const validMethods = Object.values(PaymentMethod);

    if (!validMethods.includes(method)) {
      throw new Error('Método de pagamento inválido');
    }
  }
}
