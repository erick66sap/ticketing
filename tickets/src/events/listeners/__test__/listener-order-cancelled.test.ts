import { OrderCancelledListener } from '../listener-order-cancelled';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/model-ticket';
import { OrderCancelledEvent, OrderStatus} from '@bpx-training/common';
import  * as mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    //Create a instance or the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = mongoose.Types.ObjectId().toHexString();
    //Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: 'sdsds'
    });

    ticket.set({orderId})

    await ticket.save();

    //create fake data object
    const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    // @ts-ignore`
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, ticket, data, msg, orderId}
};

it('ack the message', async ()=>{
    const {listener, ticket, data, msg , orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});
