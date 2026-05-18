# 📝 Todo List (Lista de Tarefas) - TypeScript Vanilla

Este é um projeto didático construído com HTML, CSS e **TypeScript puro (Vanilla)**. O objetivo deste projeto é ensinar os fundamentos da manipulação da página web (DOM), tipagem de dados e gerenciamento de eventos sem o uso de frameworks (como React ou Angular).

## 🚀 O que vamos aprender com este projeto?

Neste projeto, transformamos uma página estática em uma aplicação interativa. Abaixo, detalhamos os principais conceitos utilizados no código (``src/main.ts``) para que você entenda como a "mágica" acontece.

### 1. Selecionando Elementos e Avisando o TypeScript (Type Assertion)

O TypeScript é rigoroso e gosta de ter certeza sobre o que estamos manipulando. Quando buscamos um elemento no HTML (como o formulário ou um campo de texto), o TypeScript não sabe exatamente *qual* elemento foi retornado, apenas que é um elemento genérico. 

Para resolver isso, usamos a palavra `as` para fazer uma "Afirmação de Tipo" (Type Assertion). Dizemos ao TypeScript: *"Confie em mim, eu sei que este elemento é um formulário"*.

```typescript
/`/ Buscamos o formul`ário na tela e afirmamos que ele é um "HTMLFormElement"
const form = `document.querySelector`("form") as HTMLFormElement;

/`/ Buscamos o input de descri`ção e afirmamos que é um "HTMLInputElement"
const descriptionInput = `document.getElementById`("description") as HTMLInputElement;
```

Por que isso é útil? Ao fazer isso, o seu editor de código (como o VS Code) passa a autocompletar propriedades específicas daquele elemento. Por exemplo, ele saberá que descriptionInput possui uma propriedade .value

### 2. Criando o nosso próprio Tipo (Type Alias)
Em JavaScript comum, podemos colocar qualquer coisa em um objeto. No TypeScript, nós definimos regras. Criamos um "molde" chamado Todo (Tarefa) que dita exatamente quais informações uma tarefa deve ter.

```typescript
type Todo = {
  id: number;
  category: string;
  description: string;
  deadline?: string; // O ponto de interrogação (?) significa que o prazo é opcional
  done: boolean;
}

// Criamos uma lista (array) que SÓ aceita objetos que sigam o formato "Todo"
let todos: Todo[] = [];
````


### 3. Interceptando Eventos (O Formulário)

Quando você clica em "Enviar" num formulário HTML padrão, a página recarrega. Em aplicações modernas (Single Page Applications), não queremos isso. Nós interceptamos o envio usando um **Event Listener**.

```typescript
form.addEventListener("submit", (event) => {
  // Impede o comportamento padrão do navegador (que seria recarregar a página)
  event.preventDefault();

  // Pegamos os valores que o usuário digitou
  const category = categorySelect.value;
  const description = descriptionInput.value;
  const deadline = dateInput.value;

  // Criamos um novo objeto de tarefa
  const todo = {
    id: ++taskCounter,
    category,
    description,
    deadline,
    done: false
  };

  // Adicionamos a tarefa na nossa lista e atualizamos a tela
  todos.push(todo);
  updateTodos();
});
```

### 4. Criando Elementos HTML Dinamicamente pelo TypeScript

Em vez de escrever HTML estático no arquivo `index.html`, nós ensinamos o TypeScript a construir os elementos visuais (checkbox, textos e botões) para cada nova tarefa que o usuário adiciona.

```typescript
function createCheckbox(todo: Todo): HTMLInputElement {
  // Criamos um elemento de input "do zero" na memória
  const checkbox = document.createElement('input') as HTMLInputElement;
  
  // Configuramos ele para ser do tipo caixa de seleção
  checkbox.type = 'checkbox';
  
  // Adicionamos um evento: quando mudar de estado, inverte o valor de "done" na tarefa
  checkbox.addEventListener('change', () => {
    todo.done = !todo.done;
  });

  return checkbox;
}
```

Usamos `document.createElement =('nome_da_tag')` para fabricar peças de HTML e depois usamoselementoPai.appendChild(elementoFilho) para colar essas peças na página (como feito na função updateTodos).

### 5. Trabalhando com a tag `<dialog>` (O Pop-up Nativo)

Para apagar uma tarefa, usamos a tag `<dialog> ` nativa do HTML, que serve para criar janelas flutuantes (modais) sem precisar de bibliotecas externas complexas.


```typescript
removeButton.addEventListener('click', () => {
  // ... (lógica para preparar a deleção) ...
  
  // Mostra o pop-up travando o resto da página
  confirmDialog.showModal(); 
})

// Botão de cancelar fecha o modal sem fazer nada
cancelButtonDialog.addEventListener('click', () => {
  confirmDialog.close();
})
```


### 🛠️ Como rodar o projeto

1. Certifique-se de ter o Node.js instalado.
2. Abra o terminal na pasta do projeto e instale as dependências:

```
npm install
```

3. Inicie o servidor de desenvolvimento:

```
npm run dev
```

4. Acesse o link gerado no terminal (geralmente http://localhost:5173) no seu navegador.