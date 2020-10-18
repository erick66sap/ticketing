import { sign } from 'jsonwebtoken';
import * as request from 'supertest';
import { app } from '../../app';

it('response with details about the current user', async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    const response = await request(app)
    .get('/api/users/currentuser')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(200);

    console.log(response.body);

    expect(response.body.currentuser.email).toEqual('test@test.com');

});

it('response with details about the current user', async () => {

    const cookie = await global.signup();

    console.log(cookie);

    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    console.log(response.body);

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

    console.log(response.body);

    //expect(response.body.currentuser.email).toEqual(null);

});
