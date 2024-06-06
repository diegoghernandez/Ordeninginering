import { CustomInput } from '@/components/common/CustomInput'
import { CustomSelect } from '@/components/common/CustomSelect'
import { FormContainer } from '@/components/common/FormContainer'
import { PRIMARY__BUTTON } from '@/constants/styles'
import StateCities from '@/data/state_cities.json'
import { useServicePromise } from '@/hooks/useServicePromise'
import { useShoppingCart } from '@/hooks/useShoppingCart'
import { saveOrder } from '@/services/orderService'
import type { OrderRequest } from '@/types'
import { useEffect, useRef } from 'react'
import { SmallModalContainer } from '../common/SmallModalContainer'
import { getFormValue } from '@/utils/getFormValue'

interface Props {
   countryList: { code: string, name: string }[]
}

export function CheckoutForm({ countryList }: Props) {
   const { isLoading, error, response, handlePromise } = useServicePromise<OrderRequest>(saveOrder)
   const pizzaList = useShoppingCart((state) => state.pizza)
   const clearCart = useShoppingCart((state) => state.clearCart)
   const dialogRef = useRef<HTMLDialogElement>(null)

   const states = StateCities.filter(({countryId}) => countryId === 1).flatMap(({ name }) => name)
   const cities = StateCities.filter(({id}) => id === 3901).flatMap(({ cities }) => cities)

   const labels = {
      country: 'Country*',
      state: 'State*',
      city: 'City*',
      street: 'Street*',
      houseNumber: 'House number*',
      floor: 'Floor',
      apartment: 'Apartment'
   }
   
   const handleData = (formValues: FormData) => {
      const order: OrderRequest = {
         idCustomer: Number(localStorage.getItem('id')) ?? '0',
         country: getFormValue(labels.country, formValues),
         state: getFormValue(labels.state, formValues),
         city: getFormValue(labels.city, formValues),
         street: getFormValue(labels.street, formValues),
         houseNumber: Number(getFormValue(labels.houseNumber, formValues)),
         floor: Number(getFormValue(labels.floor, formValues)),
         apartment: Number(getFormValue(labels.apartment, formValues)),
         pizzaList: pizzaList.map((pizza) => {
            const { idPizza, ...rest } = pizza
            return rest
         })
      }
      
      handlePromise(order)
   }

   useEffect(() => {
      if (response?.status === 200 && dialogRef.current instanceof HTMLDialogElement) {
         dialogRef.current.showModal()
         clearCart()
      }
   }, [response?.status, clearCart])


   return (
      <FormContainer
         handleData={handleData}
         response={response?.status !== 200 ? response : null}
         submitButton={{
            label: 'Checkout',
            isLoading: isLoading
         }}
      >
         <SmallModalContainer ref={dialogRef}>
            <>
               <h2>{response?.message}</h2>
               <a href='/client/menu' className={PRIMARY__BUTTON}>Accept</a>
            </>
         </SmallModalContainer>
         <CustomSelect
            label={labels.country}
            required={true}
            values={countryList.map(({ code }) => code)}
            options={countryList.map(({ name }) => name)}
            defaultValue={{
               value: '',
               text: '--Please choose an option--'
            }}
            disable={isLoading}
         />
         <CustomSelect
            label={labels.state}
            required={true}
            values={states}
            options={states}
            defaultValue={{
               value: '',
               text: '--Please choose an option--'
            }}
            disable={isLoading}
         />
         <CustomSelect
            label={labels.city}
            required={true}
            values={cities}
            options={cities}
            defaultValue={{
               value: '',
               text: '--Please choose an option--'
            }}
            disable={isLoading}
         />
         <CustomInput 
            label={labels.street}
            required={true}
            placeholder='Alameda'
            error={error?.street}
            disable={isLoading}
         />
         <CustomInput 
            label={labels.houseNumber}
            required={true}
            type='number'
            placeholder='867'
            minValue={1}
            error={error?.houseNumber}
            disable={isLoading}
         />
         <CustomInput 
            label={labels.floor}
            type='number'
            placeholder='2'
            minValue={1}
            maxValue={200}
            error={error?.floor}
            disable={isLoading}
         />
         <CustomInput 
            label={labels.apartment}
            type='number'
            placeholder='321'
            minValue={1}
            maxValue={30000}
            error={error?.apartment}
            disable={isLoading}
         />
      </FormContainer>
   )
}