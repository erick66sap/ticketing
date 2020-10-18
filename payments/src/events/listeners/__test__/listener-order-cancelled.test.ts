import {natsWrapper} from '../../../nats-wrapper';
import {OrderCancelledListener} from '../listener-order-cancelled';
import {OrderCancelledEvent, OrderStatus} from '@bpx-training/common';
import * as mongoose from 'mongoose';
import { Order } from '../../../models/model-order';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 10,
        userId: 'dsdsd'
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1, //order.version + 1,
        ticket: {
            id: 'sasasa'
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, order};
};

it('update status of the order', async () => {
    const { listener, data, msg, order } = await setup();
    
    await listener.onMessage(data, msg);

    const updatedOrder =  await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('ack the message', async () => {
    const { listener, data, msg , order} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    
});

