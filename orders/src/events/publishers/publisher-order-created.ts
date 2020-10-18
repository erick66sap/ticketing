import { OrderCreatedEvent, Publisher, Subjects } from '@bpx-training/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}