import * as request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus} from '../../models/model-order';
import { Ticket } from '../../models/model-ticket';
import { natsWrapper} from '../../nats-wrapper';
import * as mongoose from 'mongoose';

it('has a router handler listening for post request after creating route', async () => {

    const response = await request(app)
        .post('/api/orders')
        .send({});
    
    expect(response.status).not.toEqual(404);

});
// Add validations

// add logic test

it ('returns an error if the ticket does not exist', async () =>{
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({
            ticketId
        })
        .expect(404);

});


it ('returns an error if the ticket is already reserved', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        userId: 'sadsdkkkasd',
        status: OrderStatus.Created,
        expiredAt: new Date(),
        ticket
    });
    await order.save();

//    await request(app)
//        .post('/api/orders/')
//        .set('Cookie', global.signup())
//        .send ({
//            ticketId: ticket.id
//       })
//        .expect(201);

    await request(app)
        .post('/api/orders/')
        .set('Cookie', global.signup())
        .send ({
            ticketId: ticket.id
        })
        .expect(400);

});


it ('reserves a ticket', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'concertwww',
        price: 200
    });
    await ticket.save();

    await request(app)
        .post('/api/orders/')
        .set('Cookie', global.signup())
        .send ({
            ticketId: ticket.id
        })
        .expect(201);

});


it('emits an order created event ', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'concertwww',
        price: 200
    });
    await ticket.save();

    await request(app)
    .post('/api/orders/')
    .set('Cookie', global.signup())
    .send ({
        ticketId: ticket.id
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();


});
