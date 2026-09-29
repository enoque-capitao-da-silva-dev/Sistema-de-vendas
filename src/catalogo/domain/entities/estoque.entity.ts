import { MovimentacaoEstoque } from './movimentacao-estoque.entity';
import { StockMovementOrigin } from '../enums/stock-movement-origin.enum';
import { StockMovementType } from '../enums/stock-movement-type.enum';
import { StockMovementData } from '../shared/stock-movement-data';
import { MyCustomError } from '../../errors/my-custom.error';

export class Estoque {
  private readonly pendingMovements: MovimentacaoEstoque[] = [];

  private constructor(
    private readonly id: string,
    private readonly produtoId: string,
    private quantidadeDisponivel: number,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(id: string, produtoId: string, quantidadeInicial = 0): Estoque {
    if (quantidadeInicial < 0) {
      throw new MyCustomError('O estoque inicial não pode ser negativo');
    }

    return new Estoque(
      id,
      produtoId,
      quantidadeInicial,
      new Date(),
      new Date(),
    );
  }

  static restore(params: {
    id: string;
    produtoId: string;
    quantidadeDisponivel: number;
    createdAt: Date;
    updatedAt: Date;
  }): Estoque {
    return new Estoque(
      params.id,
      params.produtoId,
      params.quantidadeDisponivel,
      params.createdAt,
      params.updatedAt,
    );
  }

  entrar(data: StockMovementData): void {
    this.validateMovementQuantity(data.quantidade);

    const quantidadeAnterior = this.quantidadeDisponivel;

    const quantidadePosterior = quantidadeAnterior + data.quantidade;

    const movimento = MovimentacaoEstoque.create({
      id: data.id,
      estoqueId: this.id,
      tipo: StockMovementType.ENTRADA,
      origem: data.origem,
      quantidade: data.quantidade,
      quantidadeAnterior,
      quantidadePosterior,
      referenciaId: data.referenciaId ?? null,
      motivo: data.motivo ?? null,
      //createdAt: data.createdAt,
    });

    this.quantidadeDisponivel = quantidadePosterior;

    this.updatedAt = data.createdAt;

    this.pendingMovements.push(movimento);
  }

  sair(data: StockMovementData): void {
    this.validateMovementQuantity(data.quantidade);

    const quantidadeAnterior = this.quantidadeDisponivel;

    if (data.quantidade > quantidadeAnterior) {
      throw new MyCustomError('Estoque insuficiente');
    }

    const quantidadePosterior = quantidadeAnterior - data.quantidade;

    const movimento = MovimentacaoEstoque.create({
      id: data.id,
      estoqueId: this.id,
      tipo: StockMovementType.SAIDA,
      origem: data.origem,
      quantidade: data.quantidade,
      quantidadeAnterior,
      quantidadePosterior,
      referenciaId: data.referenciaId ?? null,
      motivo: data.motivo ?? null,
      //createdAt: data.createdAt,
    });

    this.quantidadeDisponivel = quantidadePosterior;

    this.updatedAt = data.createdAt;

    this.pendingMovements.push(movimento);
  }

  private validateMovementQuantity(quantidade: number): void {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new MyCustomError('Quantidade de estoque invalido');
    }
  }

  private validarQuantidade(quantidade: number): void {
    if (!Number.isInteger(quantidade)) {
      throw new MyCustomError('A quantidade deve ser um número inteiro');
    }

    if (quantidade <= 0) {
      throw new MyCustomError('A quantidade deve ser maior que zero');
    }
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  getPendingMovements(): readonly MovimentacaoEstoque[] {
    return this.pendingMovements;
  }

  clearPendingMovements(): void {
    this.pendingMovements.length = 0;
  }

  getId(): string {
    return this.id;
  }

  getProdutoId(): string {
    return this.produtoId;
  }

  getQuantidadeDisponivel(): number {
    return this.quantidadeDisponivel;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
