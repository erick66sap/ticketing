import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@bpx-training/common';
import { Ticket } from '../../models/model-ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data:TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const  ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();
        msg.ack(); //call this only if it was successfully processed
        
        //console.log('Event data', data);
        //console.log(data.id);
        //console.log(data.price);
        //console.log(data.title)
        //console.log(data.usersId);
    }
}