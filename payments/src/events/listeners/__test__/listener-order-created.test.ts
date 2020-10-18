import {natsWrapper} from '../../../nats-wrapper';
import {OrderCreatedListener} from '../listener-order-created';
import {OrderCreatedEvent, OrderStatus} from '@bpx-training/common';
import * as mongoose from 'mongoose';
import { Order } from '../../../models/model-order';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id:mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'fdfdfdf',
        expiresAt: 'fdfdfd',
        ticket: {
            id: 'fsdfsdfsd',
            price: 10
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg};
};

it('replicate the order info', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById (data.id);

    expect(order!.price).toEqual(data.ticket.price);

});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    
});

