import { CategoryService } from "../service/categoryService";
import { TodoService } from "../service/todoService";
import type { Todo } from "../types";

const form = document.querySelector("form") as HTMLFormElement;
const categorySelect = document.querySelector("select") as HTMLSelectElement;
const descriptionInput = document.getElementById(
  "description",
) as HTMLInputElement;
const dateInput = document.getElementById("deadline") as HTMLInputElement;

const confirmDialog = document.querySelector("dialog") as HTMLDialogElement;
const cancelButtonDialog = document.getElementById(
  "cancel",
) as HTMLButtonElement;
const confirmButtonDialog = document.getElementById(
  "confirm",
) as HTMLButtonElement;

const divTasks = document.getElementById("tasks") as HTMLDivElement;

const todoService = new TodoService();
const categoryService = new CategoryService();

async function initilizeCategories() {
  const result = await categoryService.getAll();
  if (!result.success) {
    console.error(result.error.message);
  } else {
    for (let category of result.data) {
        let option = document.createElement("option");
        option.value = category.documentId;
        option.innerText = category.description;
        categorySelect.append(option);
      }
  }  
}

async function loadTasks() {
  const result = await todoService.getAll();
  if (!result.success) {
    console.error(result.error.message);
  } else {
    todos = result.data;
    updateTodos();
  }
}

function createCheckbox(todo: Todo): HTMLInputElement {
  const checkbox = document.createElement("input") as HTMLInputElement;

  checkbox.type = "checkbox";
  checkbox.addEventListener("change", async () => {
    todo.done = checkbox.checked;
    const result = await todoService.update(todo);
    if (!result.success) {
      console.error(result.error.message);
      checkbox.checked = !checkbox.checked; 
      todo.done = !todo.done;
    }
  });

  return checkbox;
}

function updateTodos() {
  divTasks.innerHTML = "";
  for (const todo of todos) {
    const labelTask = createUiTask(todo);
    divTasks.appendChild(labelTask);
  }
}

function createRemoveButton(todo: Todo): HTMLButtonElement {
  const removeButton = document.createElement("button");
  removeButton.innerText = "🗑️";
  removeButton.addEventListener("click", () => {
    async function deleteTaskListener() {
      const result = await todoService.delete(todo.documentId);
      if (!result.success) {
        console.error(result.error.message);
      } else {
        if (
          removeButton.parentElement &&
          removeButton.parentElement.parentElement
        ) {
          todos = todos.filter((t) => t.id != todo.id);
          removeButton.parentElement.parentElement.remove();
        }
      }
      confirmDialog.close();
    }

    confirmButtonDialog.addEventListener("click", deleteTaskListener);
    cancelButtonDialog.addEventListener("click", () => {
      confirmButtonDialog.removeEventListener("click", deleteTaskListener);
      confirmDialog.close();
    });

    confirmDialog.showModal();
  });

  return removeButton;
}

function createEditButton(
  todo: Todo,
  container: HTMLSpanElement,
  checkbox: HTMLInputElement,
): HTMLButtonElement {
  const editButton = document.createElement("button");
  editButton.innerText = "✏️";

  let isEditing = false;
  editButton.addEventListener("click", async () => {
    if (!isEditing) {
      container.contentEditable = "true";
      checkbox.disabled = true;
      editButton.innerText = "💾";
    } else {
      const originalDescription = todo.description;
      todo.description = container.innerText;
      
      const result = await todoService.update(todo);
      if (!result.success) {
        console.error(result.error.message);
        todo.description = originalDescription;
        container.innerText = originalDescription;
      } else {
        const updatedTodo = result.data;
        todos = todos.map((t) => (t.id == updatedTodo.id ? updatedTodo : t));
        editButton.innerText = "✏️";
        container.contentEditable = "false";
        checkbox.disabled = false;
      }
    }
    isEditing = !isEditing;
  });

  return editButton;
}

function createUiTask(todo: Todo) {
  const checkbox = createCheckbox(todo);
  checkbox.checked = todo.done;

  const labelTask = document.createElement("label") as HTMLLabelElement;

  const descriptionDiv = document.createElement("div");
  descriptionDiv.appendChild(checkbox);

  const spanDescription = document.createElement("span");
  spanDescription.innerText = `${todo.description}`;
  descriptionDiv.appendChild(spanDescription);

  const spanCategory = document.createElement("span");
  spanCategory.innerText = `${todo.category.description}`;
  spanCategory.classList.add(
    "category",
    todo.category.description.toLocaleLowerCase(),
  );
  descriptionDiv.append(spanCategory);

  const actionDiv = document.createElement("div");
  const removeButton = createRemoveButton(todo);
  actionDiv.appendChild(removeButton);

  const editButton = createEditButton(todo, spanDescription, checkbox);
  actionDiv.appendChild(editButton);

  labelTask.append(descriptionDiv, actionDiv);
  return labelTask;
}

let taskCounter = 0;
let todos: Todo[] = [];

initilizeCategories();
loadTasks();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const categoryId = categorySelect.value;
  const description = descriptionInput.value;
  const deadline = dateInput.value;

  const todo = {
    id: ++taskCounter,
    category: {
      documentId: categoryId,
      description:
        categorySelect.selectedOptions[0].text,
    },
    description,
    deadline,
    done: false,
  };

  const result = await todoService.create(todo);
  if (!result.success) {
    console.error(result.error.message);
    return;
  }
  
  const insertedTask = result.data;
  todos.push(insertedTask);
  updateTodos();
  descriptionInput.value = "";
});
