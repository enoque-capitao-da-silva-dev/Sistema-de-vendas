FRONTEIRAS DOS MÓDULOS

1. IDENTIDADE E ACESSO

Responsabilidade:
Gerenciar quem utiliza o sistema e o que cada usuário está autorizado a fazer.

Pertence ao módulo:
- Usuário
- Papel
- Autenticação
- Autorização
- Credenciais

Não pertence:
- Produto
- Categoria
- Cliente
- Carrinho
- Venda
- Pagamento
- Caixa
- Estoque


2. CATÁLOGO

Responsabilidade:
Gerenciar os produtos comercializados pela empresa, suas categorias e a disponibilidade em estoque.

Pertence ao módulo:
- Produto
- Categoria
- Estoque

Regras próprias:
- Ativação/desativação de produtos
- Ativação/desativação de categorias
- Preço atual do produto
- Disponibilidade em estoque

Não pertence:
- Cliente
- Carrinho
- Venda
- Pagamento
- Caixa
- Usuário


3. CLIENTES

Responsabilidade:
Gerenciar os clientes da empresa.

Pertence ao módulo:
- Cliente

Não pertence:
- Produto
- Categoria
- Carrinho
- Venda
- Pagamento
- Caixa
- Estoque


4. CARRINHO

Responsabilidade:
Gerenciar a intenção temporária de compra antes da criação da venda.

Pertence ao módulo:
- Carrinho
- ItemCarrinho

Regras próprias:
- Adicionar item
- Alterar quantidade
- Remover item
- Consultar carrinho
- Esvaziar carrinho

Não pertence:
- Produto
- Estoque
- Venda
- Pagamento
- Caixa

Observação:
O carrinho pode consultar informações do Catálogo,
mas não é dono dos produtos.


5. VENDAS

Responsabilidade:
Representar e controlar as vendas efetivamente realizadas.

Pertence ao módulo:
- Venda
- ItemVenda

Regras próprias:
- Criação da venda
- Cálculo do total
- Cancelamento da venda
- Preservação do histórico da venda
- Preservação dos dados históricos dos itens vendidos

Não pertence:
- Produto
- Categoria
- Cliente
- Estoque
- Caixa
- Usuário
- Pagamento

Observação:
A venda pode estar relacionada a esses conceitos,
mas não é proprietária deles.

O ItemVenda deverá preservar os dados necessários
para representar o produto no momento da venda.


6. PAGAMENTOS

Responsabilidade:
Representar e controlar o pagamento associado a uma venda.

Pertence ao módulo:
- Pagamento
- MétodoPagamento
- StatusPagamento

Métodos permitidos:
- DINHEIRO
- CARTAO
- MULTICAIXA_EXPRESS

Estados permitidos:
- PAGO
- CANCELADO

Não pertence:
- Venda
- Produto
- Estoque
- Cliente
- Carrinho
- Caixa


7. CAIXA

Responsabilidade:
Gerenciar a operação financeira do caixa e suas sessões.

Pertence ao módulo:
- Caixa
- SessaoCaixa
- MovimentacaoCaixa

Regras próprias:
- Abertura da sessão
- Fechamento da sessão
- Valor inicial
- Valor esperado
- Valor contado
- Diferença de caixa
- Movimentações de caixa

Não pertence:
- Venda
- Pagamento
- Produto
- Cliente
- Carrinho
- Estoque

Observação:
O Caixa pode registrar movimentações originadas
por vendas, mas a Venda não deve acessar diretamente
a infraestrutura do módulo Caixa.


REGRA ARQUITETURAL GERAL

Cada módulo é responsável pelos seus próprios dados,
regras e invariantes.

Um módulo não deverá acessar diretamente:
- entidades de persistência de outro módulo;
- repositories de outro módulo;
- tabelas do banco pertencentes a outro módulo;
- infraestrutura interna de outro módulo.

A comunicação entre módulos deverá ocorrer através
das interfaces/contratos públicos definidos por cada módulo.


PRINCÍPIO DE FRONTEIRA

A fronteira de um módulo não será definida apenas
pela tabela do banco de dados.

Será definida principalmente pela responsabilidade
sobre as regras e invariantes daquele conceito.