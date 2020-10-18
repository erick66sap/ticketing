import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@bpx-training/common';
import { queueGroupName } from './queue-group-name';
import { Message} from 'node-nats-streaming';
import { Order } from '../../models/model-order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage( data: PaymentCreatedEvent['data'],msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        
        order.set({
            status: OrderStatus.Completed  
            //after the order is completec we don't expect to change it
            //otherwiese we need to publish the change again
        });
        
        await order.save();

        msg.ack();
       

    };
}