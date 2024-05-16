import { describe, expect, it } from 'vitest'
import { getCustomerData, logIn, registerCustomer } from '@/services/customerService'

describe('Customer service tests', () => {
   describe('getCustomerData tests', () => {
      it('Should be a function', () => {
         expect(typeof getCustomerData).toBe('function')
      })

      it('Should throw a error with the following message', async () => {
         await expect(getCustomerData(42352, undefined)).rejects.toThrow('Customer not found')
      })

      it('Should return the right values', async () => {
         const content = await getCustomerData(32, undefined)

         expect(content).toStrictEqual({
            customerName: 'Customer',
            email: 'random@random.com',
            birthDate: '2002-06-12'
         })
      })
   }),

   describe('registerCustomer tests', () => {
      it('Should be a function', () => {
         expect(typeof logIn).toBe('function')
      })

      it('Should throw a error with the following message', async () => {
         await expect(logIn({
            email: 'email@email.com',
            password: 'wrong',
         })).rejects.toThrow('Invalid credentials')
      })

      it('Should return a good message', async () => {
         const response = await logIn({
            email: 'email@email.com',
            password: '1234',
         })

         expect(response).toBe('4')
      })
   })

   describe('registerCustomer tests', () => {
      it('Should be a function', () => {
         expect(typeof registerCustomer).toBe('function')
      })

      it('Should return a bad message', async () => {
         const content = await registerCustomer({
            customerName: 'Juan',
            email: 'email@email.com',
            password: '1234',
            matchingPassword: '252523',
            birthDate: '2002-2-12'
         })

         expect(content).toStrictEqual("Passwords don't match")
      })

      it('Should return a good message', async () => {
         const content = await registerCustomer({
            customerName: 'Juan',
            email: 'email@email.com',
            password: '1234',
            matchingPassword: '1234',
            birthDate: '2002-2-12'
         })

         expect(content).toStrictEqual('Account create successfully')
      })
   })
})