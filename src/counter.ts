const form: HTMLFormElement = document.querySelector("form")
const categorySelect: HTMLSelectElement = document.querySelector("select")
const descriptionInput: HTMLInputElement = document.getElementById("description")
const dateInput: HTMLInputElement = document.getElementById("deadline")

const ulTasks: HTMLUListElement = document.getElementById("tasks")

type Todo = {
  category: string,
  description: string,
  deadline?: string
}

const todos: Todo[] = []

form.addEventListener("submit", (event) => {
  event.preventDefault()

  const category = categorySelect.value
  const description = descriptionInput.value
  const deadline = dateInput.value

  const todo = {
    category,
    description,
    deadline
  }

  todos.push(todo)
  updateTodos()

})

function updateTodos() {
  ulTasks.innerHTML = ''
  for(const todo of todos) {
    ulTasks.innerHTML += `
      <li>${todo.description} - ${todo.category}</li>
    `
  }
}