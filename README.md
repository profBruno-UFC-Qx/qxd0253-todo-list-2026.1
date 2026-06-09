# 📝 Todo List (Lista de Tarefas) - TypeScript Vanilla + Strapi API

Este é um projeto didático construído com HTML, CSS e **TypeScript puro (Vanilla)** no front-end, integrado com uma **API REST** construída com **Strapi** no back-end. 

O objetivo deste projeto é ensinar os fundamentos da manipulação da página web (DOM), tipagem de dados, gerenciamento de eventos, requisições HTTP assíncronas (Fetch API), organização de código e padrões de arquitetura (Service Pattern e Result Pattern).

## 🏗️ Arquitetura

O projeto adota uma arquitetura cliente-servidor:

- **`frontend/`**: Contém a aplicação visual interativa, escrita em TypeScript Vanilla e empacotada com Vite. 
- **`backend/`**: Contém a API REST completa, desenvolvida usando o Headless CMS **Strapi**. É aqui que os dados (Tarefas, Categorias e Usuários) são persistidos e gerenciados de forma robusta.

### ✨ Boas Práticas e Evolução do Projeto

Ao longo do desenvolvimento, o projeto evoluiu para adotar práticas mais avançadas e escaláveis de estruturação de código:

1. **Service Layer Pattern (Camada de Serviços)**: Toda a lógica de comunicação com a API foi extraída dos arquivos de interface visual (`main.ts`, `todo.ts`) e movida para classes de serviço dedicadas (`ApiService`, `TodoService`, `AuthenticationService`). Isso mantém a camada visual limpa e focada apenas na interação com o DOM.
2. **Result Pattern (Tratamento de Erros)**: Em vez de espalhar blocos `try/catch` genéricos pelo código, implementamos o padrão de retorno `Result`. Funções que podem falhar retornam um objeto indicando sucesso (`{ success: true, data: T }`) ou falha (`{ success: false, error: AppError }`). Isso obriga o desenvolvedor a tratar erros explicitamente e melhora muito a previsibilidade do código.
3. **Autenticação e Controle de Sessão**: Implementação de login seguro utilizando JWT (JSON Web Tokens). O `SessionService` isola a responsabilidade de gerenciar o `localStorage`, enquanto o `ApiService` se encarrega de injetar o token nas requisições. No backend, cada Tarefa agora é vinculada ao Usuário que a criou (Owner).
4. **Gerenciamento Centralizado de Requisições**: Todo o acesso à rede agora passa pelo `ApiService`. Assim, headers, tratamentos de falhas HTTP (ex: transformar um código `404` ou `500` em um erro compreensível) e inserção de tokens são feitos em um só lugar.

---

## 🚀 O que vamos aprender com o front-end?

Abaixo, destacamos as principais decisões arquiteturais e padrões implementados no código.

### 1. Result Pattern: Tratamento Previsível de Erros

Em aplicações reais, requisições falham (queda de internet, servidor fora do ar, validação de campos) e precisamos saber o motivo. Criamos um tipo genérico `Result<T>` que nos força a verificar se uma operação deu certo antes de acessar os dados, eliminando surpresas com valores indefinidos.

```typescript
// frontend/src/types.ts
export type AppError = {
  message: string;
  status?: number;
  details?: any;
};

export type Success<T> = { success: true; data: T };
export type Failure = { success: false; error: AppError };

// Qualquer função que pode falhar retorna um Result
export type Result<T> = Success<T> | Failure;
```

### 2. Service Layer Pattern: Desacoplando Lógica da Interface

Para não misturarmos manipulação de botões com a lógica complexa de enviar dados pela rede, criamos serviços que lidam com cada responsabilidade de forma isolada. O `TodoService`, por exemplo, não sabe nada sobre HTML; ele apenas envia e recebe dados.

```typescript
// frontend/src/service/todoService.ts
export class TodoService {
  private apiService: ApiService;
  // ...

  async create(todo: Omit<Todo, "id" | "documentId">): Promise<Result<Todo>> {
    const result = await this.apiService.fetch<StrapiSingleResponse<Todo>>("/tasks", {
      method: "POST",
      body: JSON.stringify({
        data: {
          description: todo.description,
          category: todo.category.documentId,
          done: todo.done,
          deadline: todo.deadline || null,
        },
      }),
    });

    if (!result.success) return result; // Se falhou, repassamos o erro imediatamente de forma limpa
    
    return { success: true, data: { ...result.data.data, category: todo.category } };
  }
}
```

### 3. Interceptando Eventos e Tratando Resultados na Interface

Graças aos Serviços e ao padrão Result, a lógica dos nossos formulários na interface fica muito mais concisa. Não há necessidade de criar grandes blocos `try/catch`; nós simplesmente chamamos o serviço e verificamos a flag `result.success`.

```typescript
// frontend/src/pages/todo.ts
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const todo = {
    // ... construção inicial do objeto da tarefa
  };

  // Delegamos a responsabilidade de comunicação com a API ao serviço
  const result = await todoService.create(todo);
  
  // O TypeScript nos força a lidar com a falha primeiro
  if (!result.success) {
    console.error(result.error.message); // Exibe o erro ou mostra na tela para o usuário
    return;
  }
  
  // Por causa da checagem acima, o TypeScript agora garante que "result.data" existe com segurança
  const insertedTask = result.data;
  todos.push(insertedTask);
  updateTodos();
});
```

### 4. Gerenciamento Centralizado de Requisições (ApiService)

Todas as chamadas para o backend (usando `fetch`) passam por um único local central: o método `fetch` da classe `ApiService`. Isso nos permite fazer configurações globais invisíveis para o resto da aplicação.

```typescript
// frontend/src/service/api.ts
async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<Result<T>> {
  const token = this.sessionService.getToken();
  const headers = new Headers(options.headers || {});
  
  // O token de autenticação JWT é adicionado aqui! Nenhum outro serviço precisa se preocupar com isso.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // ... lógica centralizada do 'fetch' do navegador e padronização do retorno (Result)
}
```

---

## 🛠️ Como rodar o projeto

Siga os passos abaixo para executar tanto a API (Backend) quanto a Aplicação Web (Frontend).

### Passo 1: Rodando a API (Backend)

O back-end utiliza o Strapi. É necessário ter o **Node.js** instalado.

1. Abra o terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo de variáveis de ambiente (`.env`):
   - O Strapi exige algumas variáveis configuradas para funcionar. Copie o arquivo de exemplo para criar o seu:
     ```bash
     cp .env.example .env
     ```
4. Inicie o servidor de desenvolvimento do Strapi:
   ```bash
   npm run develop
   ```
   *A API agora estará rodando em `http://localhost:1337`. O painel administrativo fica disponível em `http://localhost:1337/admin`.*

### Passo 2: Rodando a Aplicação Web (Frontend)

Com a API em execução, abra **uma nova aba no terminal** e inicie o projeto frontend.

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do frontend:
   ```bash
   npm run dev
   ```
4. Acesse o link gerado no terminal (geralmente `http://localhost:5173`) no seu navegador.