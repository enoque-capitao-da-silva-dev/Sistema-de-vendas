//import { DataSource } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import type { CategoryRepository } from '../../repositories/category.repository';
import { CATEGORY_REPOSITORY } from '../../repositories/category.repository';
import type { ProductRepository } from '../../repositories/product.repository';
import { PRODUCT_REPOSITORY } from '../../repositories/product.repository';
import type { StockRepository } from '../../repositories/stock.repository';
import { STOCK_REPOSITORY } from '../../repositories/stock.repository';
import type { StockMovementRepository } from '../../repositories/stock-movement.repository';
import { STOCK_MOVEMENT_REPOSITORY } from '../../repositories/stock-movement.repository';
import type { IdGenerator } from '../../../domain/shared/id-generator';
import { ID_GENERATOR } from '../../../domain/shared/id-generator';
import { CreateProductInput } from '../../inputs/create-product.input';
import { Money } from '../../../domain/shared/money';
import { Produto } from '../../../domain/entities/produto.entity';
import { Estoque } from '../../../domain/entities/estoque.entity';
import { MovimentacaoEstoque } from '../../../domain/entities/movimentacao-estoque.entity';
import { StockMovementOrigin } from '../../../domain/enums/stock-movement-origin.enum';
import type { TransactionManager } from '../shared/transaction-manager';
import { TRANSACTION_MANAGER } from '../shared/transaction-manager';
//import { TransactionContextService } from '../../../infrastructure/persistence/typeorm/transaction/transaction-context.service';

@Injectable()
export class CreateProduct {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    //private readonly dataSource: DataSource,
    //private readonly transactionContext: TransactionContextService,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: StockRepository,
    //@Inject(STOCK_MOVEMENT_REPOSITORY)
    //private readonly stockMovementRepository: StockMovementRepository,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IdGenerator,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(input: CreateProductInput): Promise<void> {
    const categoria = await this.categoryRepository.findById(input.categoriaId);

    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    if (!categoria.estaAtiva()) {
      throw new Error('A categoria está desativada');
    }

    const exists = await this.productRepository.existsByName(input.nome.trim());

    if (exists) {
      throw new Error('Já existe um produto com esse nome');
    }

    const preco = Money.create(input.preco, 'AOA');

    const produto = Produto.create(
      this.idGenerator.generate(),
      categoria.getId(),
      input.nome,
      input.descricao ?? null,
      preco,
    );

    const estoque = Estoque.create(
      this.idGenerator.generate(),
      produto.getId(),
    );

    //let movimentacao: MovimentacaoEstoque | null = null;

    if (input.estoqueInicial > 0) {
      /*movimentacao = estoque.entrar(
        input.estoqueInicial,
        StockMovementOrigin.ESTOQUE_INICIAL,
      );*/

      estoque.entrar({
        id: this.idGenerator.generate(),
        quantidade: input.estoqueInicial,
        origem: StockMovementOrigin.ESTOQUE_INICIAL,
        referenciaId: null,
        motivo: null,
        createdAt: new Date()
      })
    }

    await this.transactionManager.run(async () => {
      await this.productRepository.save(produto);

      await this.stockRepository.save(estoque);

      /*if (movimentacao) {
        await this.stockMovementRepository.save(movimentacao);
      }*/

      throw new Error('Damn!!');
    });

    /*await this.productRepository.save(
      produto,
    );

    await this.stockRepository.save(
      estoque,
    );

    if (movimentacao) {
      await this.stockMovementRepository.save(
        movimentacao,
      );
    }*/
  }
/*
  private getRepository(): Repository<CategoryOrmEntity> {
    const manager = this.transactionContext.getManager();

    if (manager) {
      return manager.getRepository(CategoryOrmEntity);
    }

    return this.dataSource.getRepository(CategoryOrmEntity);
  }*/
}
