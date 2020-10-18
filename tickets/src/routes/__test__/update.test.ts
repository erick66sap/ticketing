import * as request from 'supertest';
import { app } from '../../app';
import * as mongoose from 'mongoose';
import { response } from 'express';
import { natsWrapper} from '../../nats-wrapper';
import { Ticket} from '../../models/model-ticket';

it('return 404 if the id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'dsdasad',
            price: 10
        })
        .expect(404);
});


it('return 401 when user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'dsdasad',
            price: 10
        })
        .expect(401);
});


it('return 401 when user does not own a ticket', async () => {
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signup())
        .send({
            title: 'dsdsd',
            price: 22
        });

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', global.signup())
            .send( {
                title: 'sadaAwww', //different title is different ticket
                price: 1000
            })
            .expect(401);


});


it('return 400 when user provides a invalid title or price', async () => {
    const cookie = global.signup();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'dsdsd',
            price: 22
        });

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: '',
                price: 22
            })
            .expect(400);

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'asdsads',
                price: -22
            })
            .expect(400);

});


it('updated the ticket with valid inputs', async () => {
    const cookie = global.signup();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'dsdsd',
            price: 22
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    
        expect(ticketResponse.body.title).toEqual('new title');
        expect(ticketResponse.body.price).toEqual(100);
        

});

it ('publishes an event', async ()=>{

    const cookie = global.signup();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'dsdsd',
            price: 22
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    console.log(natsWrapper);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updated if it is reserved ', async ()=> {
    const cookie = global.signup();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'dsdsd',
            price: 22
        });
    
    // the orderId property
    const ticket = await  Ticket.findById(response.body.id);
    
    ticket!.set({orderId: mongoose.Types.ObjectId().toHexString()});

    await ticket!.save();

    // try to update
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(400);

});