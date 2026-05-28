# 📝 Todo List (Lista de Tarefas) - TypeScript Vanilla + Strapi API

Este é um projeto didático construído com HTML, CSS e **TypeScript puro (Vanilla)** no front-end, agora integrado com uma **API REST** construída com **Strapi** no back-end. 

O objetivo deste projeto é ensinar os fundamentos da manipulação da página web (DOM), tipagem de dados, gerenciamento de eventos, requisições HTTP assíncronas (Fetch API) e organização de código.

## 🏗️ Nova Arquitetura

O projeto foi reestruturado para adotar uma arquitetura de cliente-servidor, sendo dividido em duas pastas principais:

- **`frontend/`**: Contém a aplicação visual interativa, escrita em TypeScript Vanilla e empacotada com Vite. 
- **`backend/`**: Contém a API REST completa, desenvolvida usando o Headless CMS **Strapi**. É aqui que os dados (Tarefas e Categorias) são persistidos e gerenciados de forma robusta.

### ✨ Boas Práticas Utilizadas

1. **Separação de Responsabilidades (Client/Server)**: O front-end apenas consome os dados e exibe na interface, enquanto o back-end é inteiramente responsável pela persistência e regras de banco de dados.
2. **Separação de Tipos**: Os tipos do TypeScript foram movidos para o arquivo `src/types.ts`, mantendo a lógica do `main.ts` mais limpa e focada.
3. **Comunicação Assíncrona (Async/Await)**: As operações de rede (CRUD das tarefas) são gerenciadas de maneira assíncrona com a Fetch API e blocos `try/catch` para tratamento de erros.
4. **Tipagem de Respostas de API**: Tipos genéricos (como `StrapiCollectionResponse<T>`) foram criados para mapear o formato padrão de resposta do Strapi de maneira segura e reutilizável.

---

## 🚀 O que vamos aprender com o front-end?

Abaixo, detalhamos os principais conceitos utilizados no código (``frontend/src/main.ts`` e ``frontend/src/types.ts``) para que você entenda como a "mágica" acontece.

### 1. Selecionando Elementos e Avisando o TypeScript (Type Assertion)

O TypeScript é rigoroso e gosta de ter certeza sobre o que estamos manipulando. Quando buscamos um elemento no HTML (como o formulário ou um campo de texto), o TypeScript não sabe exatamente *qual* elemento foi retornado. Para resolver isso, usamos a palavra `as` para fazer uma "Afirmação de Tipo" (Type Assertion).

```typescript
// Buscamos o formulário na tela e afirmamos que ele é um "HTMLFormElement"
const form = document.querySelector("form") as HTMLFormElement;

// Buscamos o input de descrição e afirmamos que é um "HTMLInputElement"
const descriptionInput = document.getElementById("description") as HTMLInputElement;
```

### 2. Criando Tipos para Integrar com a API (Type Alias)

Organizamos nossos "moldes" em um arquivo separado (`types.ts`). Criamos um tipo `Todo` que já prevê os atributos que vêm do banco de dados do Strapi (como `documentId`).

```typescript
export type Category = {
  documentId: string,
  description: string,
}

export type Todo = {
  id: number,
  documentId: string,
  category: Category,
  description: string,
  deadline?: string
  done: boolean
}

// Criamos uma lista (array) que SÓ aceita objetos que sigam o formato "Todo"
let todos: Todo[] = [];
```

### 3. Interceptando Eventos e Consumindo a API (O Formulário)

Interceptamos o envio do formulário. Agora, em vez de apenas inserir em uma lista na memória, enviamos os dados para a nossa API REST usando `fetch` de forma assíncrona (`async/await`).

```typescript
form.addEventListener("submit", async (event) => {
  // Impede o comportamento padrão do navegador
  event.preventDefault();

  const categoryId = categorySelect.value;
  const description = descriptionInput.value;
  const deadline = dateInput.value;

  // Montamos o objeto inicial (sem os IDs oficiais que virão do servidor)
  const todo = {
    id: ++taskCounter,
    category: {
      documentId: categoryId,
      description: categorySelect.selectedOptions[selectCategory.selectedIndex].text
    },
    description,
    deadline,
    done: false
  };

  try {
    // Enviamos para a API e esperamos a resposta com os dados definitivos
    const insertedTask = await createTask(todo);
    todos.push(insertedTask);
    updateTodos();
    descriptionInput.value = ''; // Limpa o campo
  } catch (error) {
    console.log(error);
  } 
});
```

### 4. Criando Elementos HTML Dinamicamente pelo TypeScript

Ensinamos o TypeScript a construir os elementos visuais para cada nova tarefa que o usuário adiciona.

```typescript
function createCheckbox(todo: Todo): HTMLInputElement {
  const checkbox = document.createElement('input') as HTMLInputElement;
  
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    todo.done = !todo.done;
  });

  return checkbox;
}
```

### 5. Trabalhando com a tag `<dialog>` (O Pop-up Nativo)

Para apagar uma tarefa, usamos a tag `<dialog>` nativa do HTML, que serve para criar janelas flutuantes sem bibliotecas externas.

```typescript
removeButton.addEventListener('click', () => {
  async function deleteTaskListener() {
    try {
       // Chamada à API para remover o item
       await deleteTask(todo.documentId); 

       if(removeButton.parentElement && removeButton.parentElement.parentElement) {
          todos = todos.filter( t => t.id != todo.id);
          removeButton.parentElement.parentElement.remove(); // Remove da tela
        }
    } catch(error) {
      console.log(error);
    }
    confirmDialog.close();
  }
  
  confirmButtonDialog.addEventListener('click', deleteTaskListener);
  // ...
  confirmDialog.showModal(); 
});
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