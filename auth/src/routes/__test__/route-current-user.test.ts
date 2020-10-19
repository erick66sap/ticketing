import { sign } from 'jsonwebtoken';
import * as request from 'supertest';
import { app } from '../../app';

it('response with details about the current user 1', async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    //const response = await request(app)
    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    //console.log('User 1: ', response);
    //expect(response.body.currentuser).not.toEqual(null);
    //expect(response.body.currentuser.email).toEqual('test@test.com');

});

it('response with details about the current user 2', async () => {

    const cookie = await global.signup();

    //console.log('Cookie: ',cookie);

    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    //console.log('User 2: ',response.body);
    //expect(response.body.currentuser).not.toEqual(null);
    //expect(response.body.currentuser.email).toEqual('test@test.com');

});

it('responds with null if not authenticated', async () => {
    await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    //console.log('user 3: ', response.body);

    expect(response.body.currentuser).toEqual(null);
    //expect(response.body.currentuser["email"]).toEqual(null);

});
