import { Publisher, Subjects, TicketUpdatedEvent } from '@bpx-training/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}