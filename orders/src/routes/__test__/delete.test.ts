import * as request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/model-ticket';
import { Order, OrderStatus} from '../../models/model-order';
import { natsWrapper } from '../../nats-wrapper';
import * as mongoose from 'mongoose';


it('marks an order as cancelled', async ()=>{
// create a ticket with ticket model
const id = new mongoose.Types.ObjectId().toHexString();
const ticket = Ticket.build({
    id,
    title: 'concert',
    price: 30
});
await ticket.save();

const user= global.signup();
//make a request to create an order
const {body:order} = await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({
        ticketId: ticket.id
    })
    .expect(201);

//make the request to cancel the order
await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie',user)
    .send()
    .expect(204);

//expectation to make sure the order is cancelled
const updatedOrder = await Order.findById(order.id);

expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('emits order cancelled event ', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id,
        title: 'concert',
        price: 30
    });
    await ticket.save();
    
    const user= global.signup();
    //make a request to create an order
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);
    
    //make the request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
});