import {TicketCreatedListener} from '../listener-ticket-created';
import {TicketCreatedEvent} from '@bpx-training/common';
import * as mongoose from 'mongoose';
import {natsWrapper} from '../../../nats-wrapper';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/model-ticket';

const setup = async () =>{
    //create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    //create a fake data event
    const data: TicketCreatedEvent['data']= {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg}
}

it('creates and saves a ticket', async ()=>{
    const {listener, data, msg} = await setup();

    //call the onMessage function with the data obejct +  message object
    await listener.onMessage(data, msg);
    
    //write assertions to make sure the ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);


});

it('acks //acknoledge the message', async ()=>{
    const {listener, data, msg} = await setup();

    //call the onMessage function with the data obejct +  message object
    await listener.onMessage(data, msg);

    //write assertions to make sure ack was called
    expect(msg.ack).toHaveBeenCalled();

});