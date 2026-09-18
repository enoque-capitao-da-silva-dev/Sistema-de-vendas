import { Money } from '../shared/money';
import { ProductStatus } from '../enums/product-status.enum';

export class Produto {
  private constructor(
    private readonly id: string,
    private categoriaId: string,
    private nome: string,
    private descricao: string | null,
    private preco: Money,
    private status: ProductStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  /**
   * cria um objeto novo
   *
   */
  static create(
    id: string,
    categoriaId: string,
    nome: string,
    descricao: string | null,
    preco: Money,
  ): Produto {
    if (!nome.trim()) {
      throw new Error('O nome do produto é obrigatório');
    }

    if (!categoriaId) {
      throw new Error('O produto deve possuir uma categoria');
    }

    return new Produto(
      id,
      categoriaId,
      nome.trim(),
      descricao,
      preco,
      ProductStatus.ATIVO,
      new Date(),
      new Date(),
    );
  }

  /**
   * reconstroi um objeto que já existia
   * (revistro vindo da DB por exemplo)
   */
  static restore(params: {
    id: string;
    categoriaId: string;
    nome: string;
    descricao: string | null;
    preco: Money;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Produto {
    return new Produto(
      params.id,
      params.categoriaId,
      params.nome,
      params.descricao,
      params.preco,
      params.status,
      params.createdAt,
      params.updatedAt,
    );
  }

  alterarDados(nome: string, descricao: string | null, preco: Money): void {
    if (!nome.trim()) {
      throw new Error('O nome do produto é obrigatório');
    }

    this.nome = nome.trim();
    this.descricao = descricao;
    this.preco = preco;

    this.touch();
  }

  alterarCategoria(categoriaId: string): void {
    if (!categoriaId) {
      throw new Error('Categoria inválida');
    }

    this.categoriaId = categoriaId;
    this.touch();
  }

  desativar(): void {
    if (this.status === ProductStatus.DESATIVADO) {
      throw new Error('O produto já está desativado');
    }

    this.status = ProductStatus.DESATIVADO;
    this.touch();
  }

  reativar(): void {
    if (this.status === ProductStatus.ATIVO) {
      throw new Error('O produto já está ativo');
    }

    this.status = ProductStatus.ATIVO;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getCategoriaId(): string {
    return this.categoriaId;
  }

  getNome(): string {
    return this.nome;
  }

  getDescricao(): string | null {
    return this.descricao;
  }

  getPreco(): Money {
    return this.preco;
  }

  getStatus(): ProductStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  estaAtivo(): boolean {
    return this.status === ProductStatus.ATIVO;
  }
}
