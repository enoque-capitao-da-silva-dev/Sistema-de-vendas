import { CategoryStatus } from '../enums/category-status.enum';

export class Categoria {
  private constructor(
    private readonly id: string,
    private nome: string,
    private descricao: string | null,
    private status: CategoryStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(
    id: string,
    nome: string,
    descricao: string | null = null,
  ): Categoria {
    if (!nome.trim()) {
      throw new Error('O nome da categoria é obrigatório');
    }

    return new Categoria(
      id,
      nome.trim(),
      descricao,
      CategoryStatus.ATIVA,
      new Date(),
      new Date(),
    );
  }

  static restore(params: {
    id: string,
    nome: string,
    descricao: string | null,
    status: CategoryStatus,
    createdAt: Date,
    updatedAt: Date
  }): Categoria {
    
    return new Categoria(
      params.id,
      params.nome,
      params.descricao,
      params.status,
      params.createdAt,
      params.updatedAt
    );
  }

  desativar(): void {
    if (this.status === CategoryStatus.DESATIVADA) {
      throw new Error('A categoria já está desativada');
    }

    this.status = CategoryStatus.DESATIVADA;
    this.touch();
  }

  reativar(): void {
    if (this.status === CategoryStatus.ATIVA) {
      throw new Error('A categoria já está ativa');
    }

    this.status = CategoryStatus.ATIVA;
    this.touch();
  }

  alterarDados(
    nome: string,
    descricao: string | null,
  ): void {
    if (!nome.trim()) {
      throw new Error('O nome da categoria é obrigatório');
    }

    this.nome = nome.trim();
    this.descricao = descricao;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getNome(): string {
    return this.nome;
  }

  getDescricao(): string | null {
    return this.descricao;
  }

  getStatus(): CategoryStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  estaAtiva(): boolean {
    return this.status === CategoryStatus.ATIVA;
  }
}