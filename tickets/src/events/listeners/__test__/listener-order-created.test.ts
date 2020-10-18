import { OrderCreatedListener } from '../listener-order-created';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/model-ticket';
import { OrderCreatedEvent, OrderStatus} from '@bpx-training/common';
import  * as mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    //Create a instance or the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    //Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: 'sdsds'
    });

    await ticket.save();

    //create fake data object
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sadasd',
        expiresAt: 'sads',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    // @ts-ignore`
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, ticket, data, msg}
};

it('sets the orderId of the ticket', async ()=>{
    const {listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

});

it('ack the message', async ()=>{
    const {listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});

it('publishes a ticket updated event', async ()=>{
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  
    expect(data.id).toEqual(ticketUpdatedData.orderId);

    // @ts-ignore
    //console.log(natsWrapper.client.publish.mock.calls);
    //console.log(natsWrapper.client.publish.mock.calls[0][1]);

})
