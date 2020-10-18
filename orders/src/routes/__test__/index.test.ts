import * as request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/model-order';
import { Ticket } from '../../models/model-ticket';
import * as mongoose from 'mongoose'
const buildTicket = async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'concert',
        price: 10
    });

    await ticket.save()

    return ticket;
};


it('feches orders for a particular user', async () => {
    // Create three tickes
    const ticketOne = await buildTicket();
    const ticketTwo =  await buildTicket();
    const ticketThree =  await buildTicket();

    const userOne = global.signup();
    const userTwo = global.signup();

    // Create an order for user 1
    await request(app)
        .post('/api/orders')
        .set('Cookie',userOne)
        .send({ticketId: ticketOne.id})
        .expect(201);

    //create an order for user 2
    const {body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201);

    const { body: orderTwo } =await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201);

    //make reques to get orders for user 2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie',userTwo)
        .expect(200);

    
    //console.log(orderOne);
    //console.log(orderTwo);
    //make sure we only only got the orders for user 2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);

});
