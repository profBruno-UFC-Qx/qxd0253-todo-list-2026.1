import { BASE_URL } from "./api";

export class AuthenticationService {


  async login(identifier: string, password: string) {

    const url = `${BASE_URL}/auth/local`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          identifier, 
          password
      })
    });

    if(response.ok) {
        const responseJson = await response.json()

        const responseMe = await fetch(`${BASE_URL}/users/me?populate=role`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseJson.jwt}`
        },
      });

      const roleResult = await responseMe.json()

      localStorage.setItem('jwt', responseJson.jwt)
      localStorage.setItem('username', roleResult.username)
      localStorage.setItem('usernameId', roleResult.documentId)
      localStorage.setItem('role', roleResult.role.name)

      return roleResult
    } else {
      return response.json()
    }
  }
}