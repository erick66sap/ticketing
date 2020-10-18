import * as request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/model-ticket';
import * as mongoose from 'mongoose';

it('feches orders the order', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    //Create a ticket
    const ticket = Ticket.build({
        id,
        title: 'concert',
        price: 10
    });

    await ticket.save()

    const user = global.signup();

    //make a request to build a order with this ticket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    //make request to tech the order
    const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(200);
    
    expect(fetchedOrder.id).toEqual(order.id);
    
});


it('returns an error if one user tries to fetch another user orders', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    //Create a ticket
    const ticket = Ticket.build({
        id,
        title: 'concert',
        price: 10
    });

    await ticket.save()

    const user = global.signup();

    //make a request to build a order with this ticket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    //make request to tech the order
    const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',global.signup())
        .send()
        .expect(401);
    
});

