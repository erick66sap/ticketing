import * as request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/model-ticket';
import { natsWrapper} from '../../nats-wrapper';

it('has a router handler listening for post request after creating route', async () => {

    const response = await request(app)
        .post('/api/tickets')
        .send({});
    
    expect(response.status).not.toEqual(404);

});

it('can only be accessed if the user is signed in ', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    
    expect(response.status).toEqual(401);
});

it('return status other than 401 if the user is sign in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signup())
        .send({});
    
    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided ', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            price: 10
        })
        .expect(400);
});


it('returns an error if an invalid price is provided ', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
        title: 'saasasa',
        price: -10
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
        title: 'sssdsdsd'
    })
    .expect(400);
});

it('creates a tickets with a valid inputs ', async () => {
    // add a checkto make sure a ticket was saved
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'sdasdasd';

    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signup())
        .send({
            title,
            price: 20
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);

});

it ('publishes an event', async ()=>{

    const title='sdasd';
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title,
            price: 20
        })
        .expect(201);

    console.log(natsWrapper);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
