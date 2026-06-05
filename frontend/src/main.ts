import { AuthenticationService } from "./service/authenticationService"

const form = document.querySelector('form') as HTMLFormElement
const usernameInput = document.getElementById('username') as HTMLInputElement
const passwordInput = document.getElementById('password') as HTMLInputElement
const feedbackP = document.getElementById('feedback') as HTMLParagraphElement

const authService = new AuthenticationService()

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  try {
    await authService.login(
      usernameInput.value,
      passwordInput.value
    )

    feedbackP.classList.remove('error')
    feedbackP.classList.add('success')
    let tempoRestante = 3
    feedbackP.innerText = `Você será redirecionado em ${tempoRestante--} segundos`
    const timer = setInterval(() => {
      feedbackP.innerText = `Você será redirecionado em ${tempoRestante} segundos`
      tempoRestante -= 1
    }, 1000)
    setTimeout(() => {
      clearInterval(timer)
      location.assign('/src/pages/todo.html')
    } , 3000)

  } catch (error) {
    feedbackP.innerText = (error as Error).message
    feedbackP.classList.remove('success')
    feedbackP.classList.add('error')
  }
})

