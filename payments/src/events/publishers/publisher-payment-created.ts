import {Listener, PaymentCreatedEvent, Publisher, Subjects} from '@bpx-training/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}