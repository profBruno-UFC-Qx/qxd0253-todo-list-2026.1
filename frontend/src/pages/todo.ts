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
  try {
    const categories = await categoryService.getAll();
    for (let category of categories) {
      let option = document.createElement("option");
      option.value = category.documentId;
      option.innerText = category.description;
      categorySelect.append(option);
    }
  } catch (error) {
    console.error((error as Error).message);
  }
}

async function loadTasks() {
  try {
    todos = await todoService.getAll();
    updateTodos();
  } catch (error) {
    console.log(error);
  }
}

function createCheckbox(todo: Todo): HTMLInputElement {
  const checkbox = document.createElement("input") as HTMLInputElement;

  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    todo.done = !todo.done;
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
      try {
        await todoService.delete(todo.documentId);
        console.log("tyeste");
        if (
          removeButton.parentElement &&
          removeButton.parentElement.parentElement
        ) {
          todos = todos.filter((t) => t.id != todo.id);
          removeButton.parentElement.parentElement.remove();
        }
      } catch (error) {
        console.log(error);
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
      try {
        todo.description = container.innerText;
        const updatedTodo = await todoService.update(todo);
        todos = todos.filter((t) => (t.id == updatedTodo.id ? updatedTodo : t));
        editButton.innerText = "✏️";
        container.contentEditable = "false";
        checkbox.disabled = false;
      } catch (error) {
        console.log(error);
      }
    }
    isEditing = !isEditing;
  });

  return editButton;
}

function createUiTask(todo: Todo) {
  const checkbox = createCheckbox(todo);

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

  try {
    const insertedTask = await todoService.create(todo);
    todos.push(insertedTask);
    updateTodos();
    descriptionInput.value = "";
  } catch (error) {
    console.log(error);
  }
});
