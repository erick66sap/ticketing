import * as request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/model-ticket';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'aSas',
            price: 20
        });
};

it('can fetch a list of tickt', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});