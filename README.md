# MonetizAI - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

O **MonetizAI** é uma plataforma de gestão financeira inteligente e simplificada, desenvolvida para proporcionar controle total sobre receitas e despesas com uma experiência de usuário premium e responsiva.

## 🚀 Funcionalidades

-   **Dashboard Financeiro:** Gráficos interativos (ApexCharts) com análise de evolução mensal e cotações de câmbio (Dólar/Euro) em tempo real via AwesomeAPI.
-   **Controle de Transações:** Listagem completa com filtros avançados, pesquisa e gerenciamento (CRUD) de entradas e saídas.
-   **RBAC (Controle de Acesso):** Sistema de permissões baseado em funções:
    -   `ADMIN`: Acesso total, incluindo gestão de usuários.
    -   `STANDARD`: Acesso ao dashboard e transações.
    -   `UNASSIGNED`: Tela de espera aguardando liberação.
-   **Internacionalização (i18n):** Suporte total a Português (Brasil) e Inglês (USA).
-   **Personalização:**
    -   Modo Escuro (Dark Mode) nativo.
    -   Paletas de cores dinâmicas (Padrão, Lavanda e Verde).
    -   Troca de moeda de exibição (BRL, USD, EUR).
-   **Responsividade:** UI adaptativa para Desktop e Mobile (Mobile-first design).

## 🛠️ Tecnologias Utilizadas

-   **Core:** React 19 + TypeScript
-   **Build Tool:** Vite
-   **Estilização:** Tailwind CSS
-   **Roteamento:** React Router 7
-   **Estado Global:** React Context API + Hooks customizados
-   **Gráficos:** ApexCharts
-   **Autenticação:** Google OAuth 2.0
-   **CI/CD:** AWS CodePipeline + AWS CodeBuild

## 🏁 Primeiros Passos

### Pré-requisitos

-   Node.js (v22 ou superior)
-   npm ou yarn

### Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/finance-app-frontend.git
    cd finance-app-frontend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto seguindo o modelo:
    ```env
    VITE_API_URL=http://localhost:8000/api
    VITE_GOOGLE_CLIENT_ID=seu_client_id_do_google.apps.googleusercontent.com
    ```

### Execução

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:5173` no seu navegador.

## 📦 Build e Deploy

Para gerar a versão de produção:
```bash
npm run build
```
O resultado será gerado na pasta `dist/`, pronta para ser hospedada em um bucket **Amazon S3** com **CloudFront**.

### CI/CD com AWS

O projeto já inclui um arquivo `buildspec.yml` para integração com **AWS CodeBuild**, permitindo deploys automáticos a cada push no GitHub. Certifique-se de configurar as variáveis `VITE_API_URL` e `VITE_GOOGLE_CLIENT_ID` no console do CodeBuild.

## 📂 Estrutura de Pastas

```
src/
├── assets/         # Imagens e ícones estáticos
├── components/     # Componentes UI reutilizáveis (Layout, Modal, etc)
├── hooks/          # Hooks customizados (useAuth, useSettings)
├── pages/          # Páginas principais da aplicação
├── services/       # Integração com APIs e serviços externos
├── types/          # Definições de tipos TypeScript
├── App.tsx         # Configuração de rotas e estrutura principal
├── i18n.ts         # Configuração de internacionalização
└── main.tsx        # Ponto de entrada da aplicação
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido por [Guilherme](https://github.com/seu-github) - TCC 2026
