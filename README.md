<h1 align="center" style="font-weight: bold;">JD Notify API</h1>

<p align="center">
  <a href="#technologies">Tecnologias</a> •
  <a href="#description">Descrição</a> •
  <a href="#features">Funcionalidades</a> •
  <a href="#quality">Qualidade</a> •
  <a href="#prerequisites">Pré-requisitos</a> •
  <a href="#installation">Instalação</a> •
  <a href="#scripts">Scripts</a> •
  <a href="#project-structure">Estrutura</a> •
  <a href="#routes">Rotas</a> •
  <a href="#future-improvements">Melhorias futuras</a> •
  <a href="#collaborators">Colaboradores</a>
</p>

<h2 id="technologies">💻 Tecnologias</h2>

![Static Badge](https://img.shields.io/badge/typescript%20-%203178C6?style=for-the-badge&logo=typescript&logoColor=3178C6&color=000000) ![Static Badge](https://img.shields.io/badge/node.js%20-%20339933?style=for-the-badge&logo=node.js&logoColor=339933&color=000000) ![Static Badge](https://img.shields.io/badge/express%20-%20000000?style=for-the-badge&logo=express&logoColor=FFFFFF&color=000000) ![Static Badge](https://img.shields.io/badge/prisma%20-%202D3748?style=for-the-badge&logo=prisma&logoColor=2D3748&color=000000) ![Static Badge](https://img.shields.io/badge/postgresql%20-%204169E1?style=for-the-badge&logo=postgresql&logoColor=4169E1&color=000000) ![Static Badge](https://img.shields.io/badge/docker%20-%202496ED?style=for-the-badge&logo=docker&logoColor=2496ED&color=000000) ![Static Badge](https://img.shields.io/badge/zod%20-%203E67B1?style=for-the-badge&logo=zod&logoColor=3E67B1&color=000000) ![Static Badge](https://img.shields.io/badge/biome%20-%2060A5FA?style=for-the-badge&logo=biome&logoColor=60A5FA&color=000000) ![Static Badge](https://img.shields.io/badge/swagger%20-%2085EA2D?style=for-the-badge&logo=swagger&logoColor=85EA2D&color=000000) ![Static Badge](https://img.shields.io/badge/cloudflare%20r2%20-%20F38020?style=for-the-badge&logo=cloudflare&logoColor=F38020&color=000000) ![Static Badge](https://img.shields.io/badge/resend%20-%20000000?style=for-the-badge&logo=resend&logoColor=FFFFFF&color=000000) ![Static Badge](https://img.shields.io/badge/mailtrap%20-%20%2322C55E?style=for-the-badge&logo=mailtrap&logoColor=22C55E&color=000000)

<h2 id="description">📚 Descrição</h2>

O **JD Notify API** é o backend do sistema de notificações/comunicações do projeto **JD Notify**.

A aplicação centraliza o gerenciamento de usuários, autenticação, templates de comunicação, versões de templates, envios de e-mails, anexos e agendamentos. A API foi construída com **Node.js**, **Express**, **TypeScript**, **Prisma** e **PostgreSQL**, com validação de dados usando **Zod** e documentação via **Swagger/OpenAPI**.

<h2 id="features">✨ Funcionalidades</h2>

- **Autenticação**
  - Login com e-mail e senha
  - Refresh token
  - Proteção das rotas com **JWT Bearer Token**
  - Autenticação adicional por **API Key**

- **Usuários**
  - Criação, listagem, busca, atualização e remoção de usuários
  - Hash de senha com **Argon2**

- **Templates**
  - Criação e gerenciamento de templates reutilizáveis
  - Ativação e desativação de templates
  - Associação com múltiplas versões

- **Versões de templates**
  - Controle de versões por template
  - Corpo HTML e assunto do e-mail
  - Definição de variáveis dinâmicas em JSON
  - Ativação e desativação de versões

- **Comunicações**
  - Criação de comunicações por template ou conteúdo manual
  - Envio imediato ou agendamento para envio posterior
  - Destinatários do tipo **to**, **cc** e **bcc**
  - Controle de status como rascunho, agendado, processando, enviado e falha

- **Anexos**
  - Upload de arquivos em memória com limite de **10 MB**
  - Armazenamento em **Cloudflare R2**
  - Download interno para envio junto ao e-mail
  - Remoção do arquivo no storage ao excluir anexos/comunicações

- **Disparo de e-mails**
  - Envio via **Resend**
  - Fallback para **Mailtrap**
  - Registro das tentativas de disparo
  - Renderização das variáveis dos templates antes do envio

- **Agendamentos**
  - Cron executado a cada minuto com **node-cron**
  - Busca de comunicações pendentes
  - Processamento automático dos envios agendados

<h2 id="api-docs">📄 Documentação da API</h2>

Com a aplicação em execução, a documentação Swagger fica disponível em:

```bash
http://localhost:3000/docs
```

<h2 id="quality">✅ Qualidade</h2>

O projeto utiliza **Biome** para padronização e verificação do código.

Para formatar e aplicar correções automáticas:

```bash
npm run format
```

Para gerar o build TypeScript:

```bash
npm run build
```

<h2 id="prerequisites">🧩 Pré-requisitos</h2>

- Node.js
- NPM
- Docker
- Docker Compose
- PostgreSQL, caso não utilize o container Docker do projeto

<h2 id="installation">⚙️ Instalação</h2>

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/Quanty-IT/notification-system-back.git
   ```

2. **Acesse a pasta do projeto:**

   ```bash
   cd notification-system-back
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Crie o arquivo `.env` a partir do `.env.example`:**

   ```bash
   cp .env.example .env
   ```

5. **Configure as variáveis de ambiente:**

   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgresql://postgres:root@localhost:5432/notification-system
   API_KEY=sua_api_key

   JWT_SECRET_KEY=sua_chave_secreta
   JWT_ACCESS_TOKEN_EXPIRES_IN=15m
   JWT_REFRESH_TOKEN_EXPIRES_IN=7d

   CLOUDFLARE_ENDPOINT=https://seu-endpoint-r2
   CLOUDFLARE_PUBLIC_URL=https://sua-url-publica-r2
   CLOUDFLARE_BUCKET_NAME=nome_do_bucket
   CLOUDFLARE_ACCESS_KEY_ID=sua_access_key
   CLOUDFLARE_SECRET_ACCESS_KEY=sua_secret_key

   EMAIL_FROM=JD Notify <no-reply@seudominio.com>

   RESEND_API_KEY=sua_resend_api_key

   MAILTRAP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_USER=seu_usuario_mailtrap
   MAILTRAP_PASS=sua_senha_mailtrap
   MAILTRAP_SECURE=false
   ```

6. **Suba o banco de dados com Docker:**

   ```bash
   docker compose up -d
   ```

7. **Rode as migrations do Prisma:**

   ```bash
   npx prisma migrate dev
   ```

8. **Inicie a aplicação em modo desenvolvimento:**

   ```bash
   npm run dev
   ```

A API ficará disponível em:

```bash
http://localhost:3000
```

<h2 id="scripts">📜 Scripts</h2>

| Comando          | Descrição                                      |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Inicia a API em modo desenvolvimento com watch |
| `npm run build`  | Compila o projeto TypeScript                   |
| `npm run start`  | Executa a aplicação compilada                  |
| `npm run format` | Roda o Biome e aplica correções automáticas    |

<h2 id="project-structure">📁 Estrutura do projeto</h2>

```bash
src
├── config
│   └── env.ts
├── infra
│   ├── cron
│   ├── cryptography
│   ├── database
│   ├── middlewares
│   └── swagger
├── modules
│   ├── auth
│   ├── communications
│   ├── template-versions
│   ├── templates
│   └── users
└── shared
```

<h2 id="routes">🧭 Rotas principais</h2>

| Rota                                   | Descrição                                |
| -------------------------------------- | ---------------------------------------- |
| `POST /auth/sign-in`                   | Autentica o usuário                      |
| `POST /auth/refresh-token`             | Gera novos tokens                        |
| `GET /users`                           | Lista usuários                           |
| `GET /templates`                       | Lista templates                          |
| `GET /templates/:id/versions`          | Lista versões de um template             |
| `GET /template-versions/:id`           | Busca uma versão de template             |
| `GET /communications`                  | Lista comunicações                       |
| `GET /communications/:id`              | Busca detalhes de uma comunicação        |
| `POST /communications`                 | Cria uma comunicação                     |
| `POST /communications/:id/send-now`    | Dispara uma comunicação imediatamente    |
| `POST /communications/:id/attachments` | Adiciona anexos a uma comunicação        |
| `POST /communications/:id/recipients`  | Adiciona destinatários a uma comunicação |

<h2 id="future-improvements">🔮 Melhorias futuras</h2>

- [ ] Adicionar testes unitários e E2E para os fluxos principais
- [ ] Adicionar logs estruturados
- [ ] Melhorar observabilidade dos disparos agendados
- [ ] Adicionar métricas para envios, falhas e retentativas
- [ ] Substituir o processamento com cron por filas e jobs
- [ ] Adicionar pipeline de CI para build, formatação e validação de migrations

<h2 id="collaborators">🤝 Colaboradores</h2>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/victorozoterio">
        <img src="https://avatars.githubusercontent.com/u/165734095?v=4" width="100px;" alt="Victor Ozoterio Perfil"/><br>
        <sub>
          <a href="https://github.com/victorozoterio">Victor Ozoterio</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Murilocampoos">
        <img src="https://avatars.githubusercontent.com/u/95322404?v=4" width="100px;" alt="Murilo Campos Perfil"/><br>
        <sub>
          <a href="https://github.com/Murilocampoos">Murilo Campos</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/PedroHDenny">
        <img src="https://avatars.githubusercontent.com/u/130395012?v=4" width="100px;" alt="Pedro Denny Perfil"/><br>
        <sub>
          <a href="https://github.com/PedroHDenny">Pedro Denny</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/RafaTPz">
        <img src="https://avatars.githubusercontent.com/u/125502457?v=4" width="100px;" alt="Rafael Tadeu Perfil"/><br>
        <sub>
          <a href="https://github.com/RafaTPz">Rafael Tadeu</a>
        </sub>
      </a>
    </td>
  </tr>
</table>
