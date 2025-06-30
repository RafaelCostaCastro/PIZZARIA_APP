🍕 PIZZARIA APP - Backend Node.js/Express + PostgreSQL
API RESTful para gerenciamento de produtos de uma pizzaria, com integração total via Docker Compose, PostgreSQL e CI/CD automatizado no GitHub Actions.

🚀 Como rodar a aplicação localmente
Pré-requisitos
Docker Desktop instalado e rodando

Git instalado


1. Clone o repositório
bash
git clone https://github.com/RafaelCostaCastro/PIZZARIA_APP.git

cd PIZZARIA_APP


2. Configure as variáveis de ambiente
Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:

text
DATABASE_URL=postgres://pizzauser:pizzapassword@db:5432/pizzadb


3. Suba os containers
bash
docker-compose up --build
(Isso irá criar dois containers: um para o backend (backend) e outro para o banco de dados (db).)

O backend ficará disponível em http://localhost:3000.


4. Teste a API
Você pode usar Postman ou curl para testar os endpoints.

Criar produto:
bash
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Pizza Margherita", "status": "disponível"}'

  
Listar produtos:
bash
curl http://localhost:3000/produtos
Atualizar produto:

bash
curl -X PUT http://localhost:3000/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Pizza Portuguesa", "status": "disponível"}'
Deletar produto:

bash
curl -X DELETE http://localhost:3000/produtos/1


5. Documentação Swagger
Acesse http://localhost:3000/api-docs para ver e testar a documentação interativa da API.


🧪 Como rodar os testes
Com os containers rodando, execute:
bash
docker-compose exec backend npm test
Ou, se preferir rodar localmente (fora do Docker):

bash
cd API
npm install
npm test


🔄 Pipeline CI/CD (GitHub Actions)
O que o pipeline faz?
Build e Testes:
A cada push em main, develop ou em uma TAG (v*), o pipeline executa:

- Instalação de dependências

- Testes automatizados

- Lint

- Build da imagem Docker


Publicação da Imagem Docker:
A imagem é publicada no Docker Hub com a tag correspondente (versão do package.json ou nome da tag do GitHub).


Deploy automático no Render:
Quando um push ocorre em main ou em uma tag, o pipeline faz deploy no Render usando a imagem Docker com a TAG específica daquele build.

Isso garante rastreabilidade e reprodutibilidade de deploys antigos.


Notificação de falha:
Em caso de erro em qualquer etapa do pipeline, um e-mail é enviado automaticamente para o responsável.


Como acompanhar o pipeline:
- Acesse a aba Actions do seu repositório no GitHub.

- Clique no workflow "CI/CD Pipeline".

- Veja o histórico, logs e status de cada etapa.


🏷️ Controle de TAGs e Deploys
Cada build de tag (ex: v1.2.3) gera uma imagem Docker com a mesma tag.

O deploy no Render referencia explicitamente essa imagem/tag.

Para fazer rollback/deploy de uma versão antiga, basta criar um novo deploy a partir da tag desejada.


⚙️ Principais arquivos
Arquivo/Dir	-> Função
docker-compose.yml	-> Orquestra containers
API/Dockerfile	-> Build da imagem do backend
API/package.json	-> Scripts e dependências do backend
.github/workflows/	-> Pipeline CI/CD
API/index.js	-> Código principal da API
API/db.js	-> Conexão com o banco de dados


📝 Comandos úteis
Subir containers:
docker-compose up --build

Derrubar containers:
docker-compose down

Acessar o banco via terminal:
docker-compose exec db psql -U pizzauser -d pizzadb

Executar testes:
docker-compose exec backend npm test


🛠️ Dicas e boas práticas
Automatize tudo: O pipeline já cobre build, testes, lint, publicação e deploy.

Use tags para releases: Cada tag gera uma imagem Docker exclusiva e um deploy rastreável.

Documente: Este README serve para novos desenvolvedores entenderem e rodarem tudo do zero.

Monitore: Notificações de falha são automáticas para facilitar a manutenção.


📊 Diagrama do pipeline (Mermaid)
graph TD
    A[Push/PR/Tag] --> B[Build & Test]
    B --> C[Build Docker Image]
    C --> D[Push Docker Image]
    D --> E[Deploy no Render]
    B -->|Falha| F[Notificação por e-mail]
    C -->|Falha| F
    D -->|Falha| F
    E -->|Falha| F

🛟 Dúvidas ou problemas?
Abra uma issue ou envie um pull request!
