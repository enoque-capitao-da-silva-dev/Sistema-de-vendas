import { Injectable, Inject } from '@nestjs/common';
import type { CatalogoSalesGateway } from 'src/catalogo/application/ports/catalogo-sales-gateway';
import { CATALOGO_SALES_GATEWAY } from 'src/catalogo/application/ports/catalogo-sales-gateway';
import type { CashSessionReader } from '../../ports/cash-session-reader';
import { CASH_SESSION_READER } from '../../ports/cash-session-reader';
import { CashSessionView } from '../../ports/cash-session-view';
import { CancelSaleInput } from '../../inputs/cancel-sale.input';
import type { SaleRepository } from '../../repositories/sale.repository';
import type { PaymentRepository } from '../../repositories/payment.repository';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import { PAYMENT_REPOSITORY } from '../../repositories/payment.repository';
import { SALE_REPOSITORY } from '../../repositories/sale.repository';
import type { Clock } from 'src/catalogo/domain/shared/clock';
import { CLOCK } from 'src/catalogo/domain/shared/clock';
import type { TransactionManager } from 'src/catalogo/application/use-cases/shared/transaction-manager';
import { TRANSACTION_MANAGER } from 'src/catalogo/application/use-cases/shared/transaction-manager';

@Injectable()
export class CancelSale {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
    @Inject(CATALOGO_SALES_GATEWAY)
    private readonly catalogoSalesGateway: CatalogoSalesGateway,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(CASH_SESSION_READER)
    private readonly cashSessionReader: CashSessionReader,
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(input: CancelSaleInput) {
    this.validateInput(input);

    const venda = await this.saleRepository.findById(input.saleId);

    if (!venda) {
      throw new Error(`Nenhuma venda encontrada com ID ${input.saleId}`);
    }

    /*
     * A venda não pode ser cancelada
     * duas vezes.
     */
    if (venda.isCancelled()) {
      throw new Error('A venda já está cancelada');
    }

    /*
     * A sessão à qual a venda pertence
     * precisa existir.
     */
    /*const session = await this.cashSessionReader.findById(
      venda.getSessaoCaixaId(),
    );

    if (!session) {
      throw new Error('Sessão do caixa não encontrada');
    }*/

    /*
     * Caixa só pode cancelar vendas
     * da própria sessão.
     *
     * Gerente pode cancelar qualquer
     * venda de uma sessão aberta.
     */
    //this.validateAuthorization(input.actor, session, venda.getSessaoCaixaId());

    /*
     * Busca o pagamento associado
     * à venda.
     */
    const payment = await this.paymentRepository.findBySaleId(venda.getId());

    if (!payment) {
      throw new Error('Pagamento da venda não encontrado');
    }

    if (payment.getStatus() === 'CANCELADO') {
      throw new Error('O pagamento já está cancelado');
    }

    const updatedAt = this.clock.now();

    /*
     * Altera os agregados em memória
     * antes de persistir.
     */
    venda.cancelar(updatedAt);

    payment.cancelar(updatedAt);


    /*const datas = {
      saleId: venda.getId(),
      items: venda.getItens().map((item) => ({
        productId: item.getProductId(),
        quantity: item.getQuantity(),
      })),
    };*/

    await this.transactionManager.run(async () => {
      //await this.catalogoSalesGateway.restoreStock(datas);

      //await this.saleRepository.save(venda);

      /*
       * 1. Repõe o estoque.
       */
      await this.catalogoSalesGateway.restoreStock({
        saleId: venda.getId(),

        items: venda.getItens().map((item) => ({
          productId: item.getProductId(),

          quantity: item.getQuantity(),
        })),
      });

      /*
       * 2. Persiste a venda cancelada.
       */
      await this.saleRepository.save(venda);

      /*
       * 3. Persiste o pagamento cancelado.
       */
      await this.paymentRepository.save(payment);

      /*
       * 4. Se o pagamento foi em dinheiro,
       * será registrada uma saída no caixa.
       *
       * Essa parte será implementada
       * quando fecharmos o módulo Caixa.
       */
      if (payment.getMetodo() === PaymentMethod.DINHEIRO) {
        // Cash movement
        // será implementado aqui.
      }
    });
  }

  private validateInput(input: CancelSaleInput): void {
    if (!input.saleId?.trim()) {
      throw new Error('O ID da venda é obrigatório');
    }

    if (!input.actor?.userId?.trim()) {
      throw new Error('O operador é obrigatório');
    }

    if (input.actor.role !== 'CAIXA' && input.actor.role !== 'GERENTE') {
      throw new Error('Perfil sem permissão para cancelar venda');
    }
  }

  private validateAuthorization(
    actor: CancelSaleInput['actor'],
    session: CashSessionView,
    saleSessionId: string,
  ): void {
    if (actor.role === 'GERENTE') {
      return;
    }

    if (actor.role === 'CAIXA' && session.operatorId !== actor.userId) {
      throw new Error('O caixa só pode cancelar vendas da própria sessão');
    }

    if (session.id !== saleSessionId) {
      throw new Error('A venda não pertence à sessão do caixa');
    }
  }
}
/**
  recebe o saleId
  -  valida o saleId
  busca a venda
  -  verificar se a venda foi encontrada
  busca items da venda
  -  verificar se os items da venda foram encotrados
  altera o status da venda
  - venda.cancel()
  iniciar a transação
  restuara o estoque
  salva as alteracões da venda
*/
