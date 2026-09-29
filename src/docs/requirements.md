SISTEMA DE VENDAS


OBJETIVO DO SISTEMA 

O sistema tem como objetivo permitir a gestão de vendas de produtos, considerando:
1. Gestão de produtos 
2. Gestão de catálogos
3. Gestão de clientes 
3. Gestão de carrinho de compras 
4. Realização de vendas 
5. Processamento e registo de pagamentos 
6. Controle de estoque 
7. Controle de caixa 
8. Abertura e fechamento de sessões de caixa 
9. Cancelamento de vendas 
10. Manuntenção do histórico das vendas

O sistema deverá garantir que as operações comerciais e financeiras sejam realizadas de forma consistente, rastreável e integra 


ESCOPO 

O sistema abrangirá inicialmente os seguintes domínios:

1. Catálogo 

Responsável pela gestão de:
Categorias 
Produtos 
Preços 
Estoque 
Estado de ativação dos produtos 

2. Clientes 

Responsável pelo cadastro e gestão dos clientes 

3. Carrinho 

Responsável por representar temporariamente os produtos que o cliente pretende comprar antes da finalização da venda 

4. Vendas

Responsável pela criação, consulta e cancelamento das vendas 

5. Pagamentos

Responsável pelo registro do pagamento associado a cada venda 

6. Caixa 

Responsável pelo controle operacional e financeiro das sessões de caixa 


ATORES 

Inicialmente serão definidos dois atores:

1. Caixa 

É o operador responsável pela realização das operações de venda e pela operação de uma sessão de caixa.

O caixa poderá:
Abrir uma sessão de caixa 
Consultar sua sessão atual 
Gerir o carrinho
Finalizar vendas 
Consultar as vendas da sua sessão aberta 
Cancelar vendas da sua própria sessão aberta 
Fechar sua sessão de caixa 

2. Gerente 

É o responsável pela administração e supervisão do sistema 

O gerente terá permissões superiores ãs do caixa, podendo:
Gerir produtos 
Gerir categorias 
Gerir clientes 
Consultar vendas 
Cancelar vendas de sessões aberta 
Gerir caixas 
Consultar sessões de caixa 
Consultar informações financeiras 


REQUISITOS FUNCIONAIS 

Os requisitos funcionais descrevem o que o sistema deve fazer 

RF01 - Gestão de categorias 

O sistema deverá permitir ao gerente:
Criar categorias 
Consultar categorias 
Atualizar categorias 
Desativar categorias 

Categorias não deverão ser excluídas fisicamente 

RF02 - Gestão de produtos 

O sistema deverá permitir ao gerente:
Criar produtos 
Consultar produtos 
Atualizar produtos 
Desativar produtos 
Consultar o estoque dos produtos 

Produtos não deverão ser excluídos fisicamente 

RF03 - Gestão de clientes 

O sistema deverá permitir:
Cadastrar clientes 
Consultar clientes 
Atualizar dados dos clientes 

RF04 - Gestão do carrinho 

O sistema deverá permitir:
Adicionar produtos ao carrinho 
Alterar a quantidade de um produto 
Remover produtos do carrinho 
Consultar o carrinho 
Finalizar o carrinho para criação da venda 

O carrinho não terá histórico próprio 

RF05 - Finalização de venda 

O sistema deverá permitir transformar um carrinho em uma venda 

Para isso deverá:
Validar o carrinho 
Validar os produtos 
Validar o estoque 
Calcular o valor da venda 
Processar/registrar o pagamento 
Criar venda 
Registrar os itens da venda 
Atualizar o estoque 
Atualizar o pagamento 
Esvaziar o carrinho 

Pagamento será obrigatório para a criação da venda 

RF06 - Gestão de pagamentos 

O sistema deverá registar pagamentos assosciàs vendas 

Os métodos de pagamento serão:
Dinheiro 
Cartão 
Multicaixa express 

Um pagamento poderá assumir apenas os estados:
PAGO 
CAMCELADO 

Não haverá estado PENDENTE 

RF07 - Cancelamento de venda 

O sistema deverá permitir o cancelamento de uma venda enquanto a sessão de caixa à qual ela pertence estiver aberta 

Ao cancelar uma venda, o sistema deverá:
Alterar o estado da venda para CANCELADA 
Cancelar pagamento 
Repor as quantidades dos produtos no estoque 
Registrar a saída de dinheiro do caixa quando aplicável 

Uma venda associada a uma sessão já fechada não poderá ser cancelada 

RF08 - Gestão de caixa 

O sistema deverá permitir:
Abrir uma sessão de caixa 
Consultar a sessão atual 
Registrar as operações relacionadas ao caixa 
Fechar a sessão 
Consultar o resultado do fechamento 

RF09 - Fechamento de caixa 

Ao fechar uma sessão, o sistema deverá:
Calcular o valor esperado em dinheiro 
Receber o valor efetivamente contado
Calcular a diferença 
Registrar o fechamento da sessão 

RF10 - História de vendas 

O sistema deverá manter o histórico das vendas realizadas 

O histórico deverá permanecer disponível mesmo que:
O produto seja posteriormente desativado 
O preço do produto seja alterado 
Os dados atuais do produto sejam modificados 


REQUISITOS NÃO FUNCIONAIS INICIAIS 

Além do comportamento funcional, temos requisitos relacionados à qualidade do sistema.

RNF01 - Integridade dos dados 

O sistema deverá garantir que operações relacionadas a:
Venda
Pagamento
Estoque
Caixa

Não resultem em estados inconsistentes

RNF02 - Rastreabilidade 

O sistema deverá permitir identificar:
Quem realizou uma operação 
Em qual sessão de caixa ela ocorreu 
Quando a operação ocorreu 
Quais produtos foram vendidos 
Qual foi o preço praticado no momento da venda 

RNF03 - Preservação histórica 

Dados necessários para reconstruir uma venda deverão permanecer preservados independentemente das alterações posteriores do catálogo 

RNF04 - Controle de acesso 

O sistema deverá restringir operações de acordo com o papel do usuário:
CAIXA
GERENTE

RFN05 - consistência financeira 

O sistema deverá garantir que:
valor do pagamento = valor da venda

E que o fechamento do caixa seja baseado nas movimentações financeiras efetivamente realizadas 


REGRAS DE NEGÓCIO   
  

1. Regras de produtos e categorias   
  
RN01 - Desativação de categorias   
  
Uma categoria não poderá ser excluída fisicamente.  
  
Quando deixar de estar disponível, deverá ser marcada como desativada   
  
RN02 - Desativação de produtos   
  
Um produto não poderá ser excluído fisicamente.  
  
Quando deixar de ser comercializado, deverá ser marcado como desativado   
  
RN03 - Um produto desativado não poderá ser utilizado em novas vendas.  
  
Entretanto, suas informações históricas deverão continuar disponíveis para preservar as vendas anteriores   
  
RN04 — Categoria desativada  
  
Uma categoria desativada não deverá ser utilizada para cadastrar novos produtos, conforme as regras de gestão do catálogo.  
  
Os produtos anteriormente associados à categoria deverão permanecer historicamente vinculados a ela.  
  
2. Regras do histórico da venda  
  
RN05 — Preservação da venda  
  
Uma venda realizada deverá permanecer registrada no sistema mesmo que posteriormente:  
o produto seja desativado;  
o preço do produto seja alterado;  
o nome do produto seja alterado;  
outros dados atuais do produto sejam modificados.  
  
RN06 — Histórico do item vendido  
  
O item da venda deverá preservar as informações necessárias para representar como o produto estava no momento da venda.  
  
Por exemplo:  
Produto atual  
Nome: Teclado X  
Preço atual: 30.000 Kz  
  
Venda histórica:  
Item da venda  
Nome: Teclado X  
Preço praticado: 25.000 Kz  
Quantidade: 2  
Subtotal: 50.000 Kz  
  
Se o preço atual posteriormente passar para 30.000 Kz, a venda continuará representando 25.000 Kz.  
  
3. Regras do carrinho  
  
RN07 — Carrinho sem histórico  
  
O sistema não deverá manter histórico dos carrinhos finalizados.  
  
RN08 — Carrinho após finalização  
  
Quando uma venda for finalizada com sucesso, o carrinho correspondente deverá ser esvaziado.  
  
Carrinho  
   │  
   │ finalizar venda  
   ▼  
Venda criada  
   │  
   ▼  
Carrinho vazio  
  
RN09 — Produtos do carrinho  
  
Um produto somente poderá ser adicionado ao carrinho se estiver disponível para venda.  
  
RN10 — Quantidade  
  
A quantidade de um item no carrinho deverá ser válida e positiva.  
  
4. Regras de venda  
RN11 — Venda depende de sessão de caixa  
Uma venda somente poderá ser criada quando existir uma sessão de caixa aberta.  
RN12 — Associação da venda  
Toda venda deverá estar associada à sessão de caixa em que foi realizada.  
SessaoCaixa 1 ─────── N Venda  
  
RN13 — Pagamento obrigatório  
Uma venda não poderá ser criada sem um pagamento.  
Venda  
  │  
  └── Pagamento obrigatório  
  
Não teremos venda aguardando pagamento.  
RN14 — Pagamento à vista  
Cada venda deverá ser integralmente paga no momento da sua criação.  
Não haverá:  
parcelamento;  
pagamento parcial;  
saldo devedor;  
pagamento pendente.  
RN15 — Valor do pagamento  
O valor pago deverá corresponder ao valor total da venda.  
  
valorPagamento = valorVenda  
  
RN16 — Estoque  
Uma venda somente poderá ser finalizada se existir estoque suficiente para todos os itens.  
Se qualquer item não possuir quantidade suficiente, a venda não deverá ser concluída.  
RN17 — Atualização do estoque  
Após a conclusão da venda, as quantidades vendidas deverão ser subtraídas do estoque.  
Exemplo:  
Estoque antes: 10  
Venda:          3  
Estoque depois: 7  
  
5. Regras de pagamento  
RN18 — Métodos permitidos  
O sistema aceitará somente:  
DINHEIRO  
MULTICAIXA_EXPRESS  
CARTAO  
  
RN19 — Estado do pagamento  
Um pagamento somente poderá possuir um dos estados:  
  
RN20 — Pagamento na criação da venda  
O pagamento deverá ser registrado como PAGO para que a venda seja criada com sucesso.  
RN21 — Cancelamento do pagamento  
Quando uma venda for cancelada, o pagamento associado deverá passar para:  
PAGO ─────► CANCELADO  
  
6. Regras de cancelamento da venda  
RN22 — Venda cancelável  
Uma venda somente poderá ser cancelada enquanto a sessão de caixa à qual ela pertence estiver aberta.  
RN23 — Estado da venda  
Uma venda cancelada não poderá ser cancelada novamente.  
  
RN24 — Cancelamento pelo caixa  
O operador de caixa somente poderá cancelar uma venda que:  
pertença à sua sessão de caixa;  
esteja nessa sessão atualmente aberta;  
ainda esteja ativa.  
RN25 — Cancelamento pelo gerente  
O gerente poderá cancelar uma venda de qualquer sessão, desde que a sessão à qual a venda pertence ainda esteja aberta.  
RN26 — Sessão fechada  
Nenhuma venda pertencente a uma sessão fechada poderá ser cancelada.  
Essa regra vale tanto para caixa, quanto para gerente   
  
RN27 — Reposição do estoque  
Quando uma venda for cancelada, os produtos vendidos deverão ser repostos no estoque.  
  
RN28 — Impacto no caixa  
Quando uma venda paga em dinheiro for cancelada durante uma sessão aberta, deverá ser registrada a saída correspondente no caixa.  
Para pagamentos por:  
MULTICAIXA_EXPRESS  
CARTAO  
  
não haverá entrada física de dinheiro no caixa.  
7. Regras de caixa  
RN29 — Caixa ativo  
Somente um caixa ativo poderá receber uma nova sessão de caixa.  
RN30 — Uma sessão aberta  
Um caixa não poderá possuir mais de uma sessão aberta simultaneamente.  
  
RN31 — Operador da sessão  
Uma sessão de caixa deverá estar associada a um único operador.  
RN32 — Abertura  
Ao abrir uma sessão, deverá ser informado o valor inicial do caixa.  
RN33 — Movimentação de abertura  
A abertura deverá gerar uma movimentação de caixa correspondente ao valor inicial  
  
RN34 — Venda em dinheiro  
Uma venda paga em dinheiro deverá gerar uma entrada na movimentação do caixa.  
RN35 — Venda por cartão ou Multicaixa Express  
Uma venda paga por cartão ou Multicaixa Express não deverá ser considerada dinheiro físico disponível no caixa.  
8. Regras de visualização  
RN36 — Vendas do caixa  
Um operador com papel CAIXA somente poderá consultar as vendas pertencentes à sua sessão de caixa atualmente aberta.  
RN37 — Vendas do gerente  
O gerente poderá consultar vendas pertencentes a qualquer sessão.  
RN38 — Sessões do caixa  
O caixa poderá consultar sua sessão atualmente aberta.  
O gerente poderá consultar as sessões de caixa de acordo com suas permissões administrativas.  
9. Regras de fechamento  
RN39 — Fechamento somente de sessão aberta  
  
RN40 — Valor contado  
No fechamento, o operador deverá informar o valor de dinheiro efetivamente contado.  
RN41 — Valor esperado  
O sistema deverá calcular o valor esperado em dinheiro com base nas movimentações da sessão.  
Conceitualmente:  
  Regras de negócio

1. Regras de produtos e categorias



RN01 - Desativação de categorias

Uma categoria não poderá ser excluída fisicamente.

Quando deixar de estar disponível, deverá ser marcada como desativada

RN02 - Desativação de produtos

Um produto não poderá ser excluído fisicamente.

Quando deixar de ser comercializado, deverá ser marcado como desativado

RN03 - Um produto desativado não poderá ser utilizado em novas vendas.

Entretanto, suas informações históricas deverão continuar disponíveis para preservar as vendas anteriores

RN04 — Categoria desativada

Uma categoria desativada não deverá ser utilizada para cadastrar novos produtos, conforme as regras de gestão do catálogo.

Os produtos anteriormente associados à categoria deverão permanecer historicamente vinculados a ela.

2. Regras do histórico da venda



RN05 — Preservação da venda

Uma venda realizada deverá permanecer registrada no sistema mesmo que posteriormente:
o produto seja desativado;
o preço do produto seja alterado;
o nome do produto seja alterado;
outros dados atuais do produto sejam modificados.

RN06 — Histórico do item vendido

O item da venda deverá preservar as informações necessárias para representar como o produto estava no momento da venda.

Por exemplo:
Produto atual
Nome: Teclado X
Preço atual: 30.000 Kz

Venda histórica:
Item da venda
Nome: Teclado X
Preço praticado: 25.000 Kz
Quantidade: 2
Subtotal: 50.000 Kz

Se o preço atual posteriormente passar para 30.000 Kz, a venda continuará representando 25.000 Kz.

3. Regras do carrinho



RN07 — Carrinho sem histórico

O sistema não deverá manter histórico dos carrinhos finalizados.

RN08 — Carrinho após finalização

Quando uma venda for finalizada com sucesso, o carrinho correspondente deverá ser esvaziado.

Carrinho
│
│ finalizar venda
▼
Venda criada
│
▼
Carrinho vazio

RN09 — Produtos do carrinho

Um produto somente poderá ser adicionado ao carrinho se estiver disponível para venda.

RN10 — Quantidade

A quantidade de um item no carrinho deverá ser válida e positiva.

4. Regras de venda
RN11 — Venda depende de sessão de caixa
Uma venda somente poderá ser criada quando existir uma sessão de caixa aberta.
RN12 — Associação da venda
Toda venda deverá estar associada à sessão de caixa em que foi realizada.
SessaoCaixa 1 ─────── N Venda



RN13 — Pagamento obrigatório
Uma venda não poderá ser criada sem um pagamento.
Venda
│
└── Pagamento obrigatório

Não teremos venda aguardando pagamento.
RN14 — Pagamento à vista
Cada venda deverá ser integralmente paga no momento da sua criação.
Não haverá:
parcelamento;
pagamento parcial;
saldo devedor;
pagamento pendente.
RN15 — Valor do pagamento
O valor pago deverá corresponder ao valor total da venda.

valorPagamento = valorVenda

RN16 — Estoque
Uma venda somente poderá ser finalizada se existir estoque suficiente para todos os itens.
Se qualquer item não possuir quantidade suficiente, a venda não deverá ser concluída.
RN17 — Atualização do estoque
Após a conclusão da venda, as quantidades vendidas deverão ser subtraídas do estoque.
Exemplo:
Estoque antes: 10
Venda:          3
Estoque depois: 7

5. Regras de pagamento
RN18 — Métodos permitidos
O sistema aceitará somente:
DINHEIRO
MULTICAIXA_EXPRESS
CARTAO



RN19 — Estado do pagamento
Um pagamento somente poderá possuir um dos estados:

RN20 — Pagamento na criação da venda
O pagamento deverá ser registrado como PAGO para que a venda seja criada com sucesso.
RN21 — Cancelamento do pagamento
Quando uma venda for cancelada, o pagamento associado deverá passar para:
PAGO ─────► CANCELADO

6. Regras de cancelamento da venda
RN22 — Venda cancelável
Uma venda somente poderá ser cancelada enquanto a sessão de caixa à qual ela pertence estiver aberta.
RN23 — Estado da venda
Uma venda cancelada não poderá ser cancelada novamente.



RN24 — Cancelamento pelo caixa
O operador de caixa somente poderá cancelar uma venda que:
pertença à sua sessão de caixa;
esteja nessa sessão atualmente aberta;
ainda esteja ativa.
RN25 — Cancelamento pelo gerente
O gerente poderá cancelar uma venda de qualquer sessão, desde que a sessão à qual a venda pertence ainda esteja aberta.
RN26 — Sessão fechada
Nenhuma venda pertencente a uma sessão fechada poderá ser cancelada.
Essa regra vale tanto para caixa, quanto para gerente

RN27 — Reposição do estoque
Quando uma venda for cancelada, os produtos vendidos deverão ser repostos no estoque.

RN28 — Impacto no caixa
Quando uma venda paga em dinheiro for cancelada durante uma sessão aberta, deverá ser registrada a saída correspondente no caixa.
Para pagamentos por:
MULTICAIXA_EXPRESS
CARTAO

não haverá entrada física de dinheiro no caixa.
7. Regras de caixa
RN29 — Caixa ativo
Somente um caixa ativo poderá receber uma nova sessão de caixa.
RN30 — Uma sessão aberta
Um caixa não poderá possuir mais de uma sessão aberta simultaneamente.

RN31 — Operador da sessão
Uma sessão de caixa deverá estar associada a um único operador.
RN32 — Abertura
Ao abrir uma sessão, deverá ser informado o valor inicial do caixa.
RN33 — Movimentação de abertura
A abertura deverá gerar uma movimentação de caixa correspondente ao valor inicial

RN34 — Venda em dinheiro
Uma venda paga em dinheiro deverá gerar uma entrada na movimentação do caixa.
RN35 — Venda por cartão ou Multicaixa Express
Uma venda paga por cartão ou Multicaixa Express não deverá ser considerada dinheiro físico disponível no caixa.
8. Regras de visualização
RN36 — Vendas do caixa
Um operador com papel CAIXA somente poderá consultar as vendas pertencentes à sua sessão de caixa atualmente aberta.
RN37 — Vendas do gerente
O gerente poderá consultar vendas pertencentes a qualquer sessão.
RN38 — Sessões do caixa
O caixa poderá consultar sua sessão atualmente aberta.
O gerente poderá consultar as sessões de caixa de acordo com suas permissões administrativas.
9. Regras de fechamento
RN39 — Fechamento somente de sessão aberta

RN40 — Valor contado
No fechamento, o operador deverá informar o valor de dinheiro efetivamente contado.
RN41 — Valor esperado
O sistema deverá calcular o valor esperado em dinheiro com base nas movimentações da sessão.
Conceitualmente:
Valor esperado =
    valor inicial
  + entradas em dinheiro
  - saídas em dinheiro

RN42 — Diferença
O sistema deverá calcular:
diferença =
    valor contado
    - valor esperado

Podemos obter:
diferença > 0  → sobra
diferença = 0  → caixa correto
diferença < 0  → falta

RN43 — Fechamento definitivo
Depois de fechada, a sessão não poderá voltar ao estado ABERTA.
RN44 — Sessão fechada não recebe vendas
Uma venda não poderá ser associada a uma sessão fechada.
10. Regra de consistência
RN45 — Operações relacionadas à venda
A criação de uma venda envolve várias alterações:
Venda
Pagamento
Estoque
Carrinho
Caixa

O sistema deverá garantir que essas operações não deixem o sistema em um estado parcialmente atualizado.
Por exemplo, não devemos terminar com:
Venda criada       ✅
Pagamento criado   ✅
Estoque atualizado ❌
Carrinho esvaziado ❌

A implementação dessa garantia será estudada posteriormente na arquitetura e na camada de persistência.


REGRAS CONSOLIDADAS DO CAIXA

Abertura: 
1. Caixa deve existir.
2. Caixa deve estar ativo.
3. Não pode existir outra sessão aberta para o mesmo caixa.
4. Usuário deve possuir permissão.
5. Valor inicial >= 0.

Venda:
1. Deve existir uma sessão aberta.
2. A venda pertence à sessão atual.
3. O pagamento é obrigatório.
4. O pagamento deve ser PAGO.
5. O estoque deve ser suficiente.

Visualização:
1. CAIXA: somente vendas da própria sessão aberta.
2. GERENTE: vendas de qualquer sessão.

Cancelamento:
1. CAIXA: somente vendas da própria sessão aberta.
2. GERENTE: vendas de qualquer sessão aberta.
3. Sessão fechada: nenhuma venda pode ser cancelada.

Fechamento: 
1. Sessão deve estar aberta.
2. Informar valor contado.
3. Calcular valor esperado.
4. Calcular diferença.
5. Fechar sessão.
6. Sessão fechada não recebe novas vendas.
7. Sessão fechada não pode ser reaberta.


MÓDULOS DO SISTEMA

1. Identidade e Acesso
2. Catálogo
3. Clientes
4. Carrinho
5. Vendas
6. Pagamentos
7. Caixa

CASOS DE USO DO SISTEMA DE GESTÃO DE VENDAS

ATORES:
- Caixa
- Gerente


CASOS DE USO DO CAIXA

UC01 — Abrir sessão de caixa
UC02 — Consultar sessão atual
UC03 — Gerir carrinho
UC04 — Finalizar venda
UC05 — Consultar vendas da sessão
UC06 — Consultar venda
UC07 — Cancelar venda
UC08 — Fechar sessão de caixa


CASOS DE USO DO GERENTE

UC09 — Criar categoria
UC10 — Atualizar categoria
UC11 — Desativar categoria
UC12 — Consultar categorias

UC13 — Criar produto
UC14 — Atualizar produto
UC15 — Desativar produto
UC16 — Consultar produtos
UC17 — Consultar estoque

UC18 — Gerir clientes

UC19 — Consultar vendas
UC20 — Consultar venda
UC21 — Cancelar venda

UC22 — Gerir caixas
UC23 — Consultar sessões de caixa
UC24 — Consultar movimentações de caixa


TOTAL: 24 CASOS DE USO


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


3. CLIENTES

Responsabilidade:
Gerenciar os clientes da empresa.

Pertence ao módulo:
- Cliente


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
