Transação: resolve o problema da falha no 
meio da operação, garantindo que todas as 
operações envolvidas concluam com sucesso 
ou nenhuma conclusão

Idempotência: resolve o problema da mesma 
operação de modificação de dados executada 
mais de uma vez, garantindo que apenas a 
primeira execução faça a modificação, e as 
demais execuções não consigam mais modificar 
os mesmos dados 

Uma operação é idempotente quando executá-la 
várias vezes produz o mesmo efeito de 
executá-la uma única vez.

Controle de concorrência: resolve o problema 
de operações concorrentes que modificam dados 
sobre o mesmo recurso 

---

DTO vs Input do Use Case vs Entidade de domínio

DTO: formato dos dados recebidos pela API, 
ou seja, é uma representação de entrada HTTP

Input do Use Case: dados necessários para 
executar uma operação 

Entidade de domínio: estado + regras de negócio 

---

Se cada repository estiver usando o Repository 
normal do TypeORM, podemos acabar com uma conexão 
diferente para cada repository. E então a 
transação pode não envolver todas as operações.

Por isso os repositories usados dentro da operação 
precisam utilizar o contexto transacional

Estratégia 1: Repositories recebem o contexto transacional 

Estratégia 2: Unit of work - a transação fornece um conjunto de 
repositories ligados ao mesmo contexto 

Estratégia 3: AsyncLocalStorage - o contexto transacional é 
armazenado no contexto assíncrono da execução. Os repositories 
recuperam o EntityManager atual através desse contexto.

const preco = Money.create(
  input.preco,
  input.currency,
);


---

Transação

Uma transação é um conjunto de operações na base de dados 
tratados como uma única unidade de trabalho.  
  
Onde, quando:  
1. Tudo funciona, fazemos  um COMMIT  
2. Alguma coisa falha, fazemos um ROLLBACK  
  
Garantido atomicidade da transação   
  
No Typeorm, podemos iniciar uma transação usando um DataSource, 
que por sua vez fornece um EntityManager
  
Exemplo:  
await dataSource.transaction(async (manager) => {  
  // operações  
});  
  
DataSource  
    │  
    │ inicia  
    ▼  
Transação  
    │  
    ▼  
EntityManager  


EntityManager 

O EntityManager representa o contexto (escopo) da transação. 
Tudo que deve participar daquela transação precisa utilizar 
o contexto transacional correto. 

E é uma abstração do TypeORM para executar operações sobre 
as entidades. Ele funciona como uma espécie de ponto de 
acesso às operações de persistência.

Exemplo:
await dataSource.transaction(async (manager) => {

  await manager.save(produto);

  await manager.save(estoque);

});

O callback: async (manager) => {
   ...
}

Representa o contexto/escopo da transação 

Regra importante: 
Dentro de uma transação TypeORM, as operações devem utilizar 
o EntityManager daquela transação, ou repositories obtidos
a partir dele.

EntityManager:
1. Trabalha diretamente com entidades 

Exemplo:
await manager.save(produto);

2. E também obtém repositórios

Exemplo:
const repository =
  manager.getRepository(ProductOrmEntity);

Agora esse repository está associado ao contexto daquele manager.


Unit of Work 

É um conceito arquitetural, a ideia é: reunir várias operações 
de persistência relacionadas em uma única unidade de trabalho.

Diferenças:
1. Transação - é um mecanismo da base de dados 
2. EntityManager - é uma ferramenta do ORM para realizar
   operações de persistência 
3. Unit of Work - é um padrão arquirltetural para organizar
   um conjunto de operações relacionadas como uma unidade 

Podemos resumir:
Unit of Work
      │
      │ utiliza
      ▼
Transaction
      │
      │ fornece contexto
      ▼
EntityManager
      │
      ▼
Repositories / persistência


AsyncLocalStorage

É a peça que permite manter o contexto da transação 
disponível para os repositories sem passar o 
EntityManager manualmente.

AsyncLocalStorage é uma API do Node.js que permite 
armazenar um contexto associado a uma cadeia de 
operações assíncronas.

Em vez de: productRepository.save(produto, manager);

Queremos que ele descubra o contexto automaticamente. 
É aí que entra o AsyncLocalStorage.

--

CONCORRÊNCIA

Existe concorrência quando duas ou mais operações 
tentam trabalhar sobre o mesmo recurso ao mesmo tempo.

A concorrência fica perigosa principalmente quando 
várias operações acessam e modificam o mesmo estado 
compartilhado.

Para solucionar o problema da concorrência, podemos 
usar estratégias como:

1. Estratégia de bloqueio (Lock)

Um Lock significa, enquanto estou a trabalhar neste 
recurso, outras operações não podem modificá-lo de 
determinada maneira.

1.1. Pessimistic locking - bloqueamos o recurso 
enquanto a operação estiver sendo realizada sobre ela.

No TypeORM, por exemplo, existem mecanismos para 
trabalhar com locks pessimistas dentro de transações.

Isso é muito útil quando:
conflitos são frequentes;
o recurso é muito disputado;
não queremos que várias operações alterem o mesmo registro simultaneamente.

1.2. Optmistic locking - aqui pensamos, Provavelmente ninguém alterará este 
registro enquanto estou trabalhando nele. Então adicionamos uma versão:
Produto
id: 10
estoque: 5
version: 3

Uma operação lê:
estoque = 5
version = 3

Outra operação modifica o produto:
estoque = 4
version = 4

Quando a primeira operação tenta salvar usando a versão antiga:
UPDATE produto
SET estoque = ...
    version = 4
WHERE id = 10
AND version = 3

Nenhuma linha é atualizada, o sistema percebe:
version esperada: 3
version atual:    4

Logo, o recurso foi alterado por outra operação.

A operação pode então:
abortar;
recarregar os dados;
tentar novamente;
informar conflito.

2. Operação atómica 

Uma das estratégias mais importantes é evitar:
LER → CALCULAR → ESCREVER

Quando essa sequência puder sofrer interferência 

Imagine: estoque = 1

Uma implementação ingénua poderia fazer:
estoqueAtual = buscarEstoque()
novoEstoque = estoqueAtual - 1
salvar(novoEstoque)

Existe uma janela de concorrência entre:
buscarEstoque()
E salvar()

Uma abordagem melhor pode ser realizar a própria 
operação de decremento na base de dados de forma 
condicional:

UPDATE products
SET stock = stock - 1
WHERE id = 10
AND stock >= 1;

Depois verificamos o número de linhas afetadas. 

Se: affectedRows = 1. A operação conseguiu baixar 
o estoque 

Se: affectedRows = 0. Não havia estoque suficiente 
ou outra condição impediu a operação.

Essa técnica é poderosa porque transforma a regra 
em uma operação que a base de dados pode verificar 
atomicamente.

3. Restrições 

Nem toda proteção precisa estar no código da aplicação. 
A base de dados também pode impor regras.

Por exemplo: stock >= 0, pode ser uma regra importante.

Podemos utilizar mecanismos como:
PRIMARY KEY
UNIQUE
FOREIGN KEY
CHECK
NOT NULL
Índices únicos

Isso cria uma segunda camada de proteção.

Por exemplo: CHECK (stock >= 0). Mesmo que exista um 
bug na aplicação tentando produzir: stock = -1, a base 
de dados pode rejeitar a operação 


---


DEADLOCK

Deadlock é uma situação em que duas ou mais transações 
ficam esperando umas pelas outras indefinidamente, 
até que o banco detecte o ciclo e interrompa uma delas.

Não conseguimos simplesmente eliminar todos os deadlocks 
através do código.

Mas podemos reduzir drasticamente a possibilidade deles 
adotando uma ordem determinística de aquisição dos locks.

Para uma garantia mais forte de ordem de processamento, 
a query precisa expressar essa ordenação de maneira apropriada, 
ou a estratégia pode ser estruturada para adquirir os locks em sequência.