import { Message } from 'node-nats-streaming';
import { Listener, ExpirationCompletedEvent, Subjects, OrderStatus } from '@bpx-training/common';
//import { Ticket } from '../../models/model-ticket';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/model-order';
import { OrderCancelledPublisher } from '../publishers/publisher-order-cancelled';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;

    async onMessage(data:ExpirationCompletedEvent['data'], msg: Message) {
        
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order) {
            throw new Error('Order not found');
        }

        if(order.status === OrderStatus.Completed) {
            //throw new Error('Order is completed and can not be cancelled');
            console.log('Order is completed and can not be cancelled');
            msg.ack();
            return ;
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: { id: order.ticket.id}
        });

        msg.ack(); //call this only if it was successfully processed
      
    }
}