const form = document.querySelector("form") as HTMLFormElement
const categorySelect = document.querySelector("select") as HTMLSelectElement
const descriptionInput = document.getElementById("description") as HTMLInputElement
const dateInput = document.getElementById("deadline") as  HTMLInputElement


const confirmDialog = document.querySelector('dialog') as HTMLDialogElement
const cancelButtonDialog = document.getElementById("cancel") as HTMLButtonElement
const confirmButtonDialog = document.getElementById("confirm") as HTMLButtonElement

const divTasks = document.getElementById("tasks") as HTMLDivElement

let taskCounter = 0

type Todo = {
  id: number,
  category: string,
  description: string,
  deadline?: string
  done: boolean
}

let todos: Todo[] = []



form.addEventListener("submit", (event) => {
  event.preventDefault()

  const category = categorySelect.value
  const description = descriptionInput.value
  const deadline = dateInput.value

  const todo = {
    id: ++taskCounter,
    category,
    description,
    deadline,
    done: false
  }

  todos.push(todo)
  updateTodos()

})

function createCheckbox(todo: Todo): HTMLInputElement {
  const checkbox = document.createElement('input') as HTMLInputElement
  
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', () => {
      todo.done = !todo.done
    })

    return checkbox
}
 
function updateTodos() {
  divTasks.innerHTML = ''
  for(const todo of todos) {
    const labelTask = createTask(todo)
    divTasks.appendChild(labelTask)
    
  }
  console.log(todos)
}

function createTask(todo: Todo) {
  const checkbox = createCheckbox(todo)

  const labelTask = document.createElement('label') as HTMLLabelElement
  labelTask.appendChild(checkbox)

  const spanDescription = document.createElement('span')
  spanDescription.innerText = `${todo.description} ${todo.category} ${todo.deadline}`
  labelTask.appendChild(spanDescription)

  const removeButton = document.createElement('button')
  removeButton.innerText ='🗑️'
  labelTask.appendChild(removeButton)

  removeButton.addEventListener('click', () => {

    function deleteTask() {
        if(removeButton.parentElement) {
        todos = todos.filter( t => t.id != todo.id)
        removeButton.parentElement.remove()
      }
      confirmDialog.close()
    }
    
    confirmButtonDialog.addEventListener('click', deleteTask)
    cancelButtonDialog.addEventListener('click', () => {
      confirmButtonDialog.removeEventListener('click', deleteTask)
      confirmDialog.close()
    })

    confirmDialog.showModal()
  })

  
  return labelTask
}
