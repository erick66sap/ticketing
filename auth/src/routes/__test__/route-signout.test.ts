import * as request from 'supertest';
import { app } from '../../app';

it('check it is out after signup ans signin', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    //check coookie
    console.log(response.body);

});
