import { Inject, Injectable } from '@nestjs/common';
import { CatalogoSalesGateway } from '../../catalogo/application/ports/catalogo-sales-gateway';
import { CATALOGO_SALES_GATEWAY } from '../../catalogo/application/tokens/catalogo-sales-gateway.token';
import { TransactionManager } from '../../../shared/application/transaction-manager';
import { Clock } from '../../../shared/application/clock';
import { SaleRepository } from '../domain/repositories/sale.repository';
import { PaymentRepository } from '../domain/repositories/payment.repository';
import { CashSessionReader } from '../ports/cash-session-reader';
import { PaymentMethod } from '../domain/enums/payment-method';

@Injectable()
export class CancelSale {
  constructor(
    private readonly saleRepository: SaleRepository,

    private readonly paymentRepository: PaymentRepository,

    private readonly cashSessionReader: CashSessionReader,

    @Inject(CATALOGO_SALES_GATEWAY)
    private readonly catalogoSalesGateway: CatalogoSalesGateway,

    private readonly transactionManager: TransactionManager,

    private readonly clock: Clock,
  ) {}

  async execute(input: CancelSaleInput): Promise<void> {
    this.validateInput(input);

    /*
     * Busca a venda antes de iniciar
     * as alterações.
     */
    const sale = await this.saleRepository.findById(input.saleId);

    if (!sale) {
      throw new Error('Venda não encontrada');
    }

    /*
     * A venda não pode ser cancelada
     * duas vezes.
     */
    if (sale.isCancelled()) {
      throw new Error('A venda já está cancelada');
    }

    /*
     * A sessão à qual a venda pertence
     * precisa existir.
     */
    const session = await this.cashSessionReader.findById(
      sale.getSessaoCaixaId(),
    );

    if (!session) {
      throw new Error('Sessão do caixa não encontrada');
    }

    /*
     * Cancelamento só é permitido
     * enquanto a sessão estiver aberta.
     */
    if (session.status !== 'ABERTA') {
      throw new Error(
        'A venda não pode ser cancelada porque a sessão do caixa está fechada',
      );
    }

    /*
     * Caixa só pode cancelar vendas
     * da própria sessão.
     *
     * Gerente pode cancelar qualquer
     * venda de uma sessão aberta.
     */
    this.validateAuthorization(input.actor, session, sale.getSessaoCaixaId());

    /*
     * Busca o pagamento associado
     * à venda.
     */
    const payment = await this.paymentRepository.findBySaleId(sale.getId());

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
    sale.cancelar(updatedAt);

    payment.cancelar(updatedAt);

    /*
     * Toda a operação de negócio
     * acontece dentro da mesma transação.
     */
    await this.transactionManager.run(async () => {
      /*
       * 1. Repõe o estoque.
       */
      await this.catalogoSalesGateway.restoreStock({
        saleId: sale.getId(),

        items: sale.getItens().map((item) => ({
          productId: item.getProductId(),

          quantity: item.getQuantity(),
        })),
      });

      /*
       * 2. Persiste a venda cancelada.
       */
      await this.saleRepository.save(sale);

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
