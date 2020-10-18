import { Message } from 'node-nats-streaming';
import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from '@bpx-training/common';
import { queueGroupName} from './queue-group-name';
import { Ticket } from '../../models/model-ticket';
import { TicketUpdatedPublisher } from '../publishers/publisher-ticket-updated';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'], msg: Message) {
        // find the ticket that the order is reserving.
        const ticket= await Ticket.findById(data.ticket.id);

        //if not ticket throw an error
        if (!ticket) {
            throw new Error('ticket not found');
        }
 
        // mark the ticket as being reserved by setting the orderId property
        ticket.set({orderId: data.id});

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

        //console.log('Event data', data);
        //console.log(data.id);
        //console.log(data.price);
        //console.log(data.title);
        
    }
}