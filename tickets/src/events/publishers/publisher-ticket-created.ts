import { Publisher, Subjects, TicketCreatedEvent } from '@bpx-training/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}