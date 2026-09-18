import { MovimentacaoEstoque } from './movimentacao-estoque.entity';
import { StockMovementOrigin } from '../enums/stock-movement-origin.enum';
import { StockMovementType } from '../enums/stock-movement-type.enum';
import { StockMovementData } from '../shared/stock-movement-data';

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
      throw new Error('O estoque inicial não pode ser negativo');
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

  /*
  entrar(
    quantidade: number,
    origem: StockMovementOrigin,
    referenciaId: string | null = null,
    motivo: string | null = null,
  ): MovimentacaoEstoque {
    this.validarQuantidade(quantidade);

    const anterior = this.quantidadeDisponivel;

    this.quantidadeDisponivel += quantidade;

    this.touch();

    return MovimentacaoEstoque.create({
      id: crypto.randomUUID(),
      estoqueId: this.id,
      tipo: StockMovementType.ENTRADA,
      origem,
      quantidade,
      quantidadeAnterior: anterior,
      quantidadePosterior: this.quantidadeDisponivel,
      referenciaId,
      motivo,
    });
  }*/

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

  /*
  sair(
    quantidade: number,
    origem: StockMovementOrigin,
    referenciaId: string | null = null,
  ): MovimentacaoEstoque {
    this.validarQuantidade(quantidade);

    if (quantidade > this.quantidadeDisponivel) {
      throw new Error('Estoque insuficiente');
    }

    const anterior = this.quantidadeDisponivel;

    this.quantidadeDisponivel -= quantidade;

    this.touch();

    return MovimentacaoEstoque.create({
      id: crypto.randomUUID(),
      estoqueId: this.id,
      tipo: StockMovementType.SAIDA,
      origem,
      quantidade,
      quantidadeAnterior: anterior,
      quantidadePosterior: this.quantidadeDisponivel,
      referenciaId,
      motivo: null,
    });
  }*/

  sair(data: StockMovementData): void {
    this.validateMovementQuantity(data.quantidade);

    const quantidadeAnterior = this.quantidadeDisponivel;

    if (data.quantidade > quantidadeAnterior) {
      /*throw new InsufficientStockError(
        this.produtoId,
        data.quantidade,
        quantidadeAnterior,
      );*/
      throw new Error('Estoque insuficiente');
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
      //throw new InvalidStockQuantityError(quantidade);
      throw new Error('Quantidade de estoque invalido');
    }
  }

  
  ajustar(
    quantidadeReal: number,
    motivo: string,
    referenciaId: string | null,
  ): MovimentacaoEstoque | null {
    if (!Number.isInteger(quantidadeReal)) {
      throw new Error('A quantidade real deve ser um número inteiro');
    }

    if (quantidadeReal < 0) {
      throw new Error('A quantidade real não pode ser negativa');
    }

    if (!motivo.trim()) {
      throw new Error('O motivo do ajuste é obrigatório');
    }

    const quantidadeAnterior = this.quantidadeDisponivel;

    if (quantidadeReal === quantidadeAnterior) {
      return null;
    }

    const diferenca = quantidadeReal - quantidadeAnterior;

    if (diferenca > 0) {
      this.quantidadeDisponivel = quantidadeReal;

      return MovimentacaoEstoque.create({
        id: crypto.randomUUID(),
        estoqueId: this.id,
        tipo: StockMovementType.ENTRADA,
        origem: StockMovementOrigin.AJUSTE,
        quantidade: diferenca,
        quantidadeAnterior,
        quantidadePosterior: quantidadeReal,
        referenciaId,
        motivo,
      });
    }

    const quantidadeSaida = Math.abs(diferenca);

    this.quantidadeDisponivel = quantidadeReal;
    return MovimentacaoEstoque.create({
      id: crypto.randomUUID(),
      estoqueId: this.id,
      tipo: StockMovementType.SAIDA,
      origem: StockMovementOrigin.AJUSTE,
      quantidade: quantidadeSaida,
      quantidadeAnterior,
      quantidadePosterior: quantidadeReal,
      referenciaId,
      motivo,
    });
  }

  private validarQuantidade(quantidade: number): void {
    if (!Number.isInteger(quantidade)) {
      throw new Error('A quantidade deve ser um número inteiro');
    }

    if (quantidade <= 0) {
      throw new Error('A quantidade deve ser maior que zero');
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
