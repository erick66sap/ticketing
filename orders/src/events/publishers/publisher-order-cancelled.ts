import { OrderCancelledEvent, Publisher, Subjects } from '@bpx-training/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled; 
}