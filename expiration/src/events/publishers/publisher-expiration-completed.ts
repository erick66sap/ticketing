import { ExpirationCompletedEvent, Publisher, Subjects } from '@bpx-training/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}