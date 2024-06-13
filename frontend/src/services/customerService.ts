import type { CustomerDto, CustomerLogIn } from '@/types'
import { StatusError } from '@/services/exceptions/StatusError'

const URL = import.meta.env.PUBLIC_URL ?? 'http://localhost:8765'
export const API = URL +  '/customer'

export async function logIn(customerLogIn: CustomerLogIn): Promise<string> {
   const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerLogIn)
   })
   
   if (response.ok) return response.text()
   else throw new StatusError('Invalid credentials', response.status)
}

export async function registerCustomer(customerDto: CustomerDto): Promise<string> {
   const response = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerDto)
   })

   if (response.ok) return response.text()
   else {
      const errorResponse = await response.json()
      throw new StatusError(errorResponse.desc, response.status, errorResponse.fieldError)
   }
}