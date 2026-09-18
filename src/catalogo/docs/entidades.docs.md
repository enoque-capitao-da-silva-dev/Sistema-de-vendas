ENTIDADES

-  Categoria
-  Produto
-  Estoque
-  MovimentacaoEstoque


VALUE OBJECTS / TIPOS DE VALOR

-  Money
-  Quantidade


ENUMS / TIPOS DE DOMÍNIO

-  StatusProduto
-  StatusCategoria
-  TipoMovimentacao
-  OrigemMovimentacao


--------------------------


COMPORTAMENTOLS DAS ENTIDADES


Categoria

-  criar
-  alterar
-  desativar
-  reativar

Produto

-  criar
-  alterar dados
-  alterar preço
-  alterar categoria
-  desativar
-  reativar

Estoque
-  adicionar
-  remover
-  ajustar
-  consultar histórico


--------------------------


INAVARIANTES FINAIS DO PRODUTO 

INV-P01 — ID único
Todo produto possui um identificador único.

INV-P02 — Nome obrigatório
Todo produto possui um nome.

INV-P03 — Nome único
Não podem existir dois produtos com o mesmo nome.

INV-P04 — Preço válido
Todo produto possui preço maior que zero.

INV-P05 — Categoria
Todo produto pertence a uma categoria válida.

INV-P06 — Estado válido
O produto só pode estar ATIVO ou DESATIVADO.

INV-P07 — Produto desativado
Produto desativado não pode ser utilizado em novas vendas.

INV-P08 — Reativação
Produto desativado pode voltar a ser ATIVO.

INV-P09 — Exclusão
Produto nunca é excluído fisicamente.

INV-P10 — Histórico
Alterações no produto não podem modificar dados históricos
já registrados em vendas.

INV-P11 — Estoque inicial
A criação de um produto exige a definição do estoque inicial.


--------------------------


CATEGORIA

Responsabilidade:
Representar a classificação utilizada para organizar os produtos
do catálogo.


ATRIBUTOS

- id
- nome
- descricao
- status
- createdAt
- updatedAt


ESTADOS

ATIVA
DESATIVADA


REGRAS

CAT-C01 — Identificação
Toda categoria deverá possuir um identificador único.

CAT-C02 — Nome obrigatório
Toda categoria deverá possuir um nome.

CAT-C03 — Nome único
Não poderão existir duas categorias com o mesmo nome.

CAT-C04 — Unicidade case-insensitive
A comparação do nome deverá ignorar diferenças entre
maiúsculas e minúsculas.

Exemplos:

"Informática"
"informática"
"INFORMÁTICA"

→ representam o mesmo nome.

CAT-C05 — Descrição opcional
A descrição poderá ser informada, mas não será obrigatória.

CAT-C06 — Estado
A categoria somente poderá estar nos estados:

ATIVA
DESATIVADA

CAT-C07 — Exclusão física proibida
Uma categoria não poderá ser excluída fisicamente.

CAT-C08 — Desativação
Uma categoria ativa poderá ser desativada.

ATIVA → DESATIVADA

CAT-C09 — Reativação
Uma categoria desativada poderá ser reativada.

DESATIVADA → ATIVA

CAT-C10 — Categoria desativada
Uma categoria desativada não poderá ser utilizada
para cadastrar novos produtos.

CAT-C11 — Produtos existentes
A desativação de uma categoria não deverá:

- excluir produtos;
- desassociar produtos;
- desativar automaticamente os produtos.

Os produtos anteriormente associados permanecerão
vinculados à categoria.

CAT-C12 — Mudança de categoria
Um produto poderá mudar de categoria.

CAT-C13 — Categoria de destino
Um produto somente poderá ser associado a uma categoria
ATIVA.

CAT-C14 — Reativação condicionada

Um produto desativado somente poderá ser reativado se a sua
categoria estiver ATIVA.

Produto DESATIVADO
        │
        ▼
Categoria ATIVA?
   │          │
  SIM        NÃO
   │          │
   ▼          ▼
Reativar    Rejeitar
produto     operação


--------------------------


ESTOQUE

Responsabilidade:
Manter a quantidade atual disponível de cada produto e o
histórico imutável de todas as movimentações de estoque.


CONCEITOS

Estoque
- id
- produtoId
- quantidadeDisponivel

MovimentacaoEstoque
- id
- estoqueId
- tipo
- origem
- quantidade
- quantidadeAnterior
- quantidadePosterior
- motivo
- createdAt


RELAÇÃO

Produto 1 ───── 1 Estoque

Estoque 1 ───── N MovimentacaoEstoque


TIPOS DE MOVIMENTAÇÃO

ENTRADA
SAIDA


ORIGENS DAS MOVIMENTAÇÕES

ESTOQUE_INICIAL
AQUISICAO
VENDA
CANCELAMENTO_VENDA
AJUSTE


REGRAS

INV-E01 — Existência
Todo produto possui um estoque associado.

INV-E02 — Quantidade inteira
A quantidade disponível deverá ser um número inteiro.

INV-E03 — Quantidade não negativa
A quantidade disponível nunca poderá ser inferior a zero.

INV-E04 — Estoque inicial
A criação de um produto exige uma quantidade inicial
de estoque válida.

INV-E05 — Registro da movimentação
Toda alteração efetiva na quantidade do estoque deverá
gerar uma movimentação correspondente.

INV-E06 — Tipo
Toda movimentação deverá possuir um dos tipos:

ENTRADA
SAIDA

INV-E07 — Origem
Toda movimentação deverá possuir uma origem definida.

INV-E08 — Quantidade
A quantidade movimentada deverá ser positiva.

INV-E09 — Saída
Uma saída somente poderá ocorrer quando existir estoque
suficiente.

INV-E10 — Imutabilidade
Uma movimentação registrada não poderá ser alterada
nem excluída.

INV-E11 — Estoque zerado
Um produto poderá estar ativo mesmo quando seu estoque
for igual a zero.

INV-E12 — Produto desativado
A desativação de um produto não elimina seu estoque
nem seu histórico de movimentações.

INV-E13 — Aquisição
A aquisição de novos produtos/unidades poderá gerar
uma movimentação de ENTRADA.

INV-E14 — Venda
A venda poderá gerar uma movimentação de SAIDA.

INV-E15 — Cancelamento
O cancelamento de uma venda poderá gerar uma movimentação
de ENTRADA para reposição das unidades.

INV-E16 — Ajuste manual
O estoque poderá ser ajustado manualmente pelo gestor.

INV-E17 — Direção do ajuste
Um ajuste poderá gerar:

ENTRADA
ou
SAIDA

INV-E18 — Motivo do ajuste
Todo ajuste manual deverá possuir um motivo obrigatório.


EXEMPLOS

ESTOQUE INICIAL

Estoque: 0
     ↓
+20 unidades
     ↓
Estoque: 20

Movimentação:
Tipo: ENTRADA
Origem: ESTOQUE_INICIAL
Quantidade: 20
Anterior: 0
Posterior: 20


AQUISIÇÃO

Estoque: 20
     ↓
+50 unidades
     ↓
Estoque: 70

Movimentação:
Tipo: ENTRADA
Origem: AQUISICAO
Quantidade: 50
Anterior: 20
Posterior: 70


VENDA

Estoque: 70
     ↓
-5 unidades
     ↓
Estoque: 65

Movimentação:
Tipo: SAIDA
Origem: VENDA
Quantidade: 5
Anterior: 70
Posterior: 65


CANCELAMENTO DE VENDA

Estoque: 65
     ↓
+5 unidades
     ↓
Estoque: 70

Movimentação:
Tipo: ENTRADA
Origem: CANCELAMENTO_VENDA
Quantidade: 5
Anterior: 65
Posterior: 70


AJUSTE

Estoque: 70
     ↓
-2 unidades
     ↓
Estoque: 68

Movimentação:
Tipo: SAIDA
Origem: AJUSTE
Quantidade: 2
Anterior: 70
Posterior: 68
Motivo:
"Unidades danificadas identificadas na contagem física."


PRINCÍPIO DE HISTÓRICO

As movimentações representam registros históricos.

Portanto:

- Não podem ser alteradas.
- Não podem ser excluídas.
- Correções devem ser realizadas através de uma nova
  movimentação.


