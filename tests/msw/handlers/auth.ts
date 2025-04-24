import { http, HttpResponse } from 'msw'

const user = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@tk.local',
}

export const unauthenticated = http.get('http://localhost:3000/api/auth/get-session', () => {
  return HttpResponse.json(null)
})

export const authenticated = http.get('http://localhost:3000/api/auth/get-session', () => {
  return HttpResponse.json({ data: { user, session: { id: '1' } } })
})

export const loginSuccess = http.post('http://localhost:3000/api/auth/sign-in/email', () => {
  return HttpResponse.json({ data: { user } })
})

export const loginFailed = http.post('http://localhost:3000/api/auth/sign-in/email', () => {
  return HttpResponse.json(
    {
      code: 'INVALID_EMAIL_OR_PASSWORD',
      message: 'Invalid email or password',
    },
    { status: 401 },
  )
})

export const signUpSuccess = http.post('http://localhost:3000/api/auth/sign-up/email', () => {
  return HttpResponse.json({ data: { user } })
})

export const signUpFailed = http.post('http://localhost:3000/api/auth/sign-up/email', () => {
  return HttpResponse.json(
    {
      code: 'USER_ALREADY_EXISTS',
      message: 'User already exists',
    },
    { status: 422 },
  )
})

export const handlers = [authenticated, loginSuccess, signUpSuccess]
