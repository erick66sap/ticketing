import {ExpirationCompletedListener} from '../listener-expiration-completed';
import * as mongoose from 'mongoose';
import {natsWrapper} from '../../../nats-wrapper';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/model-ticket';
import {Order} from '../../../models/model-order';

import {ExpirationCompletedEvent, OrderStatus} from '@bpx-training/common';

const setup = async () =>{
    //create an instance of the listener
    const listener = new ExpirationCompletedListener (natsWrapper.client);

    //create a ticket
    const ticket =  Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 100,
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'dsd',
        expiredAt: new Date(),
        ticket
    });

    await order.save();

    //fake data object
    const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id
    };

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { ticket, listener, order, data, msg};
};

it('update the order status to cancelled', async ()=>{
    const { ticket, listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder =  await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});


it('emit an orderCancelled event', async ()=>{
    const { ticket, listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);

});


it('ack message', async ()=>{
    const { ticket, listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);
  
    expect(msg.ack).toHaveBeenCalled();
});