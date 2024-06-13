import { connect } from 'amqplib'
import { CustomerRoleRepositoryImpl } from '../repository/CustomerRoleRepositoryImpl'

const connection = await connect('amqp://localhost')
const channel = await connection.createChannel()

export class CustomerMessage {
   onSaveCustomerRole = async () => {
      const queue = 'q.save-customer-role'
      await channel.assertQueue(queue, { durable: false })
      const customerRepository = new CustomerRoleRepositoryImpl()
      
      await channel.consume(queue, async (msg) => {
         const customerId = Number(JSON.parse(msg?.content.toString()?? '')?.customerId)
         console.log(customerId);
         
         if ((await customerRepository.existById(customerId)).length === 0) {
            await customerRepository.save(customerId)
         }
      })
   }
}