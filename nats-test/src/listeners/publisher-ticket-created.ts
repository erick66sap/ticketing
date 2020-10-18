//import { Publisher, Subjects, TicketCreatedEvent } from '@bpx-training/common';
import { Publisher } from './publisher-base';
import {Subjects} from './subjects';
import {TicketCreatedEvent} from './event-ticket-created';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}