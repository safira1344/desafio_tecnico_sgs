# Sistema de Gestão de Solicitações (SGS)

Aplicação web para registro, consulta e acompanhamento de solicitações de
pagamento, desenvolvida como desafio técnico para a vaga de Programador de
Sistemas de Computação.

## Tecnologias utilizadas

- **Backend**: Java 17 + Spring Boot (Web, Data JPA, Validation)
- **Banco de dados**: PostgreSQL
- **Frontend**: HTML, CSS e JavaScript puro (sem framework)
- **Build**: Maven
- **Versionamento**: Git

## Estrutura do projeto

desafio_tecnico_sgs/
│
├── backend/              # API Java Spring Boot
│
├── frontend/             # Interface web (HTML/CSS/JS)
│
├── database/             # Scripts do banco de dados
│   ├── 1-ddl.sql         # Criação das tabelas
│   └── 2-dml.sql         # População com dados de teste
│
└── README.md             # Documentação do projeto


## Modelagem do banco de dados

O banco é composto por 3 tabelas:

- **solicitante**: `id` (PK), `nome`, `cpf_cnpj` (único)
- **categoria**: `id` (PK), `nome` (único)
- **solicitacao**: `id` (PK), `solicitante_id` (FK), `categoria_id` (FK),
  `descricao`, `valor`, `data_solicitacao`, `status`

### Relacionamentos

- Um solicitante pode ter várias solicitações (1:N)
- Uma categoria pode estar associada a várias solicitações (1:N)

## Regras de negócio

Toda solicitação é criada com status inicial `SOLICITADO`. As transições de
status permitidas são:

| De          | Para                    |
|-------------|-------------------------|
| SOLICITADO  | LIBERADO ou REJEITADO   |
| LIBERADO    | APROVADO ou REJEITADO   |
| APROVADO    | CANCELADO               |
| REJEITADO   | *(estado final)*        |
| CANCELADO   | *(estado final)*        |

Essa validação é aplicada no backend (camada Service) e refletida no
frontend, que só exibe as opções de transição válidas para cada status.

## Pré-requisitos

- Java 17+
- Maven (ou usar o Maven Wrapper incluso, `mvnw`)
- PostgreSQL (local ou via Docker)
- Um servidor local simples para o frontend (ex: extensão Live Server do VS Code)

## Como executar o projeto

### 1. Banco de dados

Crie um banco PostgreSQL e execute os scripts na ordem:

```bash
psql -U seu_usuario -d seu_banco -f database/1-ddl.sql
psql -U seu_usuario -d seu_banco -f database/2-dml.sql
```

Ou execute o conteúdo dos arquivos diretamente pelo DBeaver/pgAdmin.

### 2. Backend

Configure a conexão com o banco em
`backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nome_do_banco
spring.datasource.username=postgres
spring.datasource.password=sua_senha
```

> **Nota**: por simplicidade, a senha do banco está diretamente no
> `application.properties`, já que este é um ambiente de desenvolvimento
> local para fins de avaliação.

Execute a aplicação:

```bash
cd backend
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

### 3. Frontend

Abra a pasta `frontend/index.html` com um servidor local (recomendado: extensão
**Live Server** do VS Code, clicando com o botão direito no `index.html` →
"Open with Live Server"). Isso evita problemas de CORS.

Por padrão, o frontend espera o Live Server rodando em `http://127.0.0.1:5500`
(configurado via `@CrossOrigin` no backend). Se sua porta for diferente,
ajuste a anotação `@CrossOrigin` nos Controllers.

## Endpoints da API

| Método | Rota                              | Descrição                          |
|--------|------------------------------------|-------------------------------------|
| POST   | `/api/solicitacoes`               | Cria uma nova solicitação           |
| GET    | `/api/solicitacoes`               | Lista solicitações (com filtros opcionais: `status`, `categoriaId`, `dataInicio`, `dataFim`) |
| GET    | `/api/solicitacoes/{id}`          | Detalha uma solicitação específica  |
| PATCH  | `/api/solicitacoes/{id}/status`   | Atualiza o status de uma solicitação|
| GET    | `/api/solicitantes`               | Lista todos os solicitantes         |
| GET    | `/api/categorias`                 | Lista todas as categorias           |

## Decisões técnicas

- **Status como `VARCHAR` + `CHECK` (em vez de `ENUM` nativo do PostgreSQL)**:
  facilita alterações futuras nos valores permitidos sem precisar de migrações
  complexas no tipo do banco. No Java, o status é representado por um `enum`
  (`StatusSolicitacao`), garantindo segurança de tipos em tempo de compilação,
  mesmo com o banco usando `VARCHAR`.

- **Lombok**: utilizado para reduzir código repetitivo de getters/setters nas
  entidades e DTOs.

- **DTOs (Data Transfer Objects)**: a listagem principal usa uma *projection*
  (`SolicitacaoListagemDTO`) para retornar exatamente os campos necessários
  da query nativa (com dados de 3 tabelas), evitando expor a estrutura interna
  das entidades JPA. Também há DTOs de entrada (`SolicitacaoRequestDTO`,
  `AtualizarStatusRequestDTO`) para desacoplar o contrato da API do modelo
  interno.

- **Native Query com `CAST` explícito**: a query nativa de listagem usa
  `CAST(:parametro AS tipo)` em todas as ocorrências de cada parâmetro. Isso
  foi necessário porque o PostgreSQL não consegue inferir automaticamente o
  tipo de um parâmetro quando ele é `NULL` (usado para representar "filtro não
  aplicado"), causando erro `could not determine data type of parameter`.

- **CORS via `@CrossOrigin`**: como o frontend roda em uma origem diferente
  do backend (Live Server na porta 5500, backend na porta 8080), o CORS foi
  liberado explicitamente nos Controllers para essa origem.

- **Tratamento de erros com try/catch nos Controllers**: optou-se por uma
  abordagem direta de tratamento de exceções em cada endpoint (retornando
  `400` para dados inválidos/transições inválidas e `404` para recursos não
  encontrados), priorizando clareza e simplicidade sobre um handler global.

- **Senha do banco em texto plano no `application.properties`**: decisão
  consciente para simplificar a execução do projeto pelo avaliador, adequada
  para um ambiente de desenvolvimento local. Em um cenário de produção, seria
  substituída por variáveis de ambiente ou um gerenciador de segredos.

## Autor

Fernanda Mirely.