import { StockMovementOrigin } from '../enums/stock-movement-origin.enum';
import { StockMovementType } from '../enums/stock-movement-type.enum';

export class MovimentacaoEstoque {
  private constructor(
    private readonly id: string,
    private readonly estoqueId: string,
    private readonly tipo: StockMovementType,
    private readonly origem: StockMovementOrigin,
    private readonly quantidade: number,
    private readonly quantidadeAnterior: number,
    private readonly quantidadePosterior: number,
    private readonly referenciaId: string | null,
    private readonly motivo: string | null,
    private readonly createdAt: Date,
  ) {}

  static create(params: {
    id: string;
    estoqueId: string;
    tipo: StockMovementType;
    origem: StockMovementOrigin;
    quantidade: number;
    quantidadeAnterior: number;
    quantidadePosterior: number;
    referenciaId?: string | null;
    motivo?: string | null;
  }): MovimentacaoEstoque {
    if (params.quantidade <= 0) {
      throw new Error('A quantidade movimentada deve ser menor que zero');
    }

    if (params.quantidadeAnterior < 0) {
      throw new Error('A quantidade anterior não pode ser negativa');
    }

    if (params.quantidadePosterior < 0) {
      throw new Error('A quantidade posterior não pode ser negativa');
    }

    return new MovimentacaoEstoque(
      params.id,
      params.estoqueId,
      params.tipo,
      params.origem,
      params.quantidade,
      params.quantidadeAnterior,
      params.quantidadePosterior,
      params.referenciaId ?? null,
      params.motivo ?? null,
      new Date(),
    );
  }

  static restore(params: {
    id: string;
    estoqueId: string;
    tipo: StockMovementType;
    origem: StockMovementOrigin;
    quantidade: number;
    quantidadeAnterior: number;
    quantidadePosterior: number;
    referenciaId: string | null;
    motivo: string | null;
    createdAt: Date;
  }) {
    return new MovimentacaoEstoque(
      params.id,
      params.estoqueId,
      params.tipo,
      params.origem,
      params.quantidade,
      params.quantidadeAnterior,
      params.quantidadePosterior,
      params.referenciaId,
      params.motivo,
      params.createdAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getEstoqueId(): string {
    return this.estoqueId;
  }

  getTipo(): StockMovementType {
    return this.tipo;
  }

  getOrigem(): StockMovementOrigin {
    return this.origem;
  }

  getQuantidade(): number {
    return this.quantidade;
  }

  getQuantidadeAnterior(): number {
    return this.quantidadeAnterior;
  }

  getQuantidadePosterior(): number {
    return this.quantidadePosterior;
  }

  getReferenciaId(): string | null {
    return this.referenciaId;
  }

  getMotivo(): string | null {
    return this.motivo;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
