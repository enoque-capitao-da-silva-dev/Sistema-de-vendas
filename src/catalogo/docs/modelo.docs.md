┌────────────────────────────┐
│       Categoria                 │
├────────────────────────────┤
│ id                              │
│ nome                            │
│ descricao                       │
│ status                          │
│ createdAt                       │
│ updatedAt                       │
└────────────────────────────┘
             │
             │ 1 : N
             ▼

┌────────────────────────────┐
│          Produto                │
├────────────────────────────┤
│ id                              │
│ categoriaId                     │
│ nome                            │
│ descricao                       │
│ preco : Money                   │
│ status                          │
│ createdAt                       │
│ updatedAt                       │
└────────────────────────────┘
             │
             │ 1 : 1
             ▼

┌────────────────────────────┐
│          Estoque                │
├────────────────────────────┤
│ id                              │
│ produtoId                       │
│ quantidadeDisponivel            │
│ createdAt                       │
│ updatedAt                       │
└────────────────────────────┘
             │
             │ 1 : N
             ▼

┌────────────────────────────┐
│    MovimentacaoEstoque          │
├────────────────────────────┤
│ id                              │
│ estoqueId                       │
│ tipo                            │
│ origem                          │
│ quantidade                      │
│ quantidadeAnterior              │
│ quantidadePosterior             │
│ referenciaId                    │
│ motivo                          │
│ createdAt                       │
└────────────────────────────┘



--------------------------


REGRAS DE NEGÓCIO DE CATÃLOGO


RN01 — Desativação de categorias

Uma categoria não poderá ser excluída fisicamente.

Quando deixar de estar disponível, deverá ser marcada
como desativada.


RN02 — Desativação de produtos

Um produto não poderá ser excluído fisicamente.

Quando deixar de ser comercializado, deverá ser marcado
como desativado.


RN03 — Produto desativado

Um produto desativado não poderá ser utilizado
em novas vendas.

Entretanto, suas informações históricas deverão
continuar disponíveis.


RN04 — Categoria desativada

Uma categoria desativada não deverá ser utilizada
para cadastrar novos produtos.

Os produtos anteriormente associados à categoria
deverão permanecer historicamente vinculados a ela.


--------------------------


CASOS DE USO DO CATÁLOGO


CATEGORIA 

UC-C01 — Criar categoria
UC-C02 — Consultar categoria
UC-C03 — Listar categorias
UC-C04 — Atualizar categoria
UC-C05 — Desativar categoria
UC-C06 — Reativar categoria


PRODUTO 

UC-P01 — Criar produto
UC-P02 — Consultar produto
UC-P03 — Listar produtos
UC-P04 — Atualizar produto
UC-P05 — Desativar produto
UC-P06 — Reativar produto
UC-P07 — Alterar categoria do produto


ESTOQUE

UC-E01 — Consultar estoque
UC-E02 — Consultar histórico de movimentações
UC-E03 — Registrar aquisição
UC-E04 — Ajustar estoque


--------------------------


DECISÃO ARQUITETURAL


CAT-INT-01

A saída de estoque de uma venda será solicitada em uma
única operação contendo todos os itens da venda.

CAT-INT-02

Antes de alterar qualquer estoque, deverão ser verificadas
as quantidades disponíveis de todos os itens.

CAT-INT-03

A operação será atômica dentro da transação da aplicação.

CAT-INT-04

Cada alteração de estoque deverá gerar sua respectiva
movimentação histórica.

CAT-INT-05

A movimentação deverá identificar a venda que originou
a operação.

CAT-INT-06

O cancelamento de uma venda gerará novas movimentações
de entrada, não alteração das movimentações anteriores.

CAT-INT-07

As operações de saída e reposição deverão ser idempotentes.

CAT-INT-08

Vendas não terá acesso direto aos agregados ou repositórios
internos do Catálogo.

ARQ-CAT-09

O domínio conhece interfaces de persistência, 
mas não conhece TypeORM, Postgres ou qualquer 
detalhe de infraestrutura

