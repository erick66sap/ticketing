import {TicketUpdatedListener} from '../listener-ticket-updated';
import {TicketUpdatedEvent} from '@bpx-training/common';
import * as mongoose from 'mongoose';
import {natsWrapper} from '../../../nats-wrapper';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/model-ticket';

const setup = async () =>{
    //create an instance of the listener
    const listener = new TicketUpdatedListener (natsWrapper.client);

    //create a ticket
    const ticket =  Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 100,

    });

    await ticket.save();

    //fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 99,
        userId: 'sdsds'
    };

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { ticket, listener, data, msg};
};

it('find, create and  saves a ticket', async ()=>{
    const {ticket, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks //acknoledge the message', async ()=>{
    const {ticket, listener, data, msg} = await setup();

    //call the onMessage function with the data obejct +  message object
    await listener.onMessage(data, msg);

    //write assertions to make sure ack was called
    expect(msg.ack).toHaveBeenCalled();

});

it(' does not call ack if the event has a future version', async ()=>{
    const {ticket, listener, data, msg} = await setup();

    data.version = 100;

    try {
        await listener.onMessage(data,msg);
    }
    catch (err) {

    }
    expect(msg.ack).not.toHaveBeenCalled();
    //const updatedTicket = await Ticket.findById(ticket.id);

});