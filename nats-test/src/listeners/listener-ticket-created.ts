import { Message } from 'node-nats-streaming';
import {Listener} from './listener-base';
import { TicketCreatedEvent} from './event-ticket-created';
import { Subjects} from './subjects';

//import { Listener, TicketCreatedEvent, Subjects } from '@bpx-training/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';

    onMessage(data:TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data', data);
        
        console.log(data.id);
        console.log(data.price);
        console.log(data.title);

        msg.ack();
    }
}