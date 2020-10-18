import * as request from 'supertest';
import { app } from '../../app';
import * as mongoose from 'mongoose';


it('return 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
      //.post('/api/tickets/sadasdasdasd') this will giev an error
    await request(app)
        .post(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('return ticket if ticket is  found', async () => {
    const title ='concert';
    const price = 10;
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie' , global.signup())
        .send({
            title,
            price
        })
        .expect(201);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
        
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});