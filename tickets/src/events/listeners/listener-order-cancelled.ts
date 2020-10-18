import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@bpx-training/common';
import { queueGroupName} from './queue-group-name';
import { Ticket } from '../../models/model-ticket';
import { TicketUpdatedPublisher } from '../publishers/publisher-ticket-updated';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data:OrderCancelledEvent['data'], msg: Message) {
        //console.log('Event data', data);

         // find the ticket that the order is reserving.
         const ticket= await Ticket.findById(data.ticket.id);

         //if not ticket throw an error
         if (!ticket) {
             throw new Error('ticket not found');
         }
  
         // mark the ticket as being reserved by setting the orderId property
         ticket.set({orderId: undefined });  //better use undefined instead of null
 
         //save ticket
         await ticket.save();
 
        //publish the change of the ticket
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

         // ack the message
         msg.ack();
 
    }
}