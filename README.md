# Desafio Técnico - Solicitação de Antecipação de Parcelas

Este projeto é uma aplicação full stack para um módulo de CRM, onde clientes podem solicitar antecipações de parcelas de contratos.

## 🗂 Estrutura do Repositório

```
/projeto/
├── AdvanceRequestApi/        # Projeto .NET 8 (ASP.NET Web API)
├── AdvanceRequestFrontend/       # Projeto React + Vite + Tailwind + Shadcn + React Query
└── README.md
```

---

## 🧪 Funcionalidades

- Autenticação via código do contrato (`contractCode`)
- Listagem de solicitações
- Criação de nova solicitação (selecionando parcelas disponíveis)
- Aprovação em massa
- Detalhamento de uma solicitação
- Validação de regras de negócio (ex: parcelas válidas para antecipação)

---

## 🚀 Como rodar o projeto

### 🔧 Backend (.NET 8)

```bash
cd AdvanceRequestApi
dotnet restore
dotnet run
```

> O backend rodará por padrão em `https://localhost:7170`

- Certifique-se de aceitar o certificado HTTPS se for autogerado.
- A API Swagger estará disponível em: `https://localhost:7170/swagger`

### 💻 Frontend (React + Vite)

```bash
cd AdvanceRequestFrontend
npm install
npm run dev
```

> O frontend rodará em `http://localhost:5173`

### 🌐 Comunicação entre Frontend e Backend

- O backend já permite CORS para `http://localhost:5173`
- O token JWT retornado no login é armazenado e enviado automaticamente nas requisições

---

## 📦 Dados de Teste

Use o seguinte código de contrato para testar o login:

```
contractCode: CONTRATO-001 ou CONTRATO-002
```

---

## ✅ Requisitos Técnicos Atendidos

- [.NET 8 Web API com Clean Architecture](#)
- React + TypeScript + Tailwind + React Query + Shadcn UI
- Context API para autenticação
- Integração com backend protegida com JWT
- Requisições protegidas com token
- Boas práticas de separação de responsabilidades
- Código limpo e semântico

---
