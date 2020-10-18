import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@bpx-training/common';
import { Ticket } from '../../models/model-ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data:TicketUpdatedEvent['data'], msg: Message) {
        //const ticket = await Ticket.findById(data.id);
        const ticket = await Ticket.findByEvent(data);

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        const {title, price } = data;
        ticket.set( {title, price });
    
    //    const {title, price, version } = data;
    //    ticket.set( {title, price, version});
    
        await ticket.save();
        msg.ack(); //call this only if it was successfully processed
        
        //console.log('Event data', data);
        //console.log(data.id);
        //console.log(data.price);
        //console.log(data.title)
        //console.log(data.usersId);
    }
}