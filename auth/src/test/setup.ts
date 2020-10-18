import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { app }  from '../app';
import * as request from 'supertest';

declare global {
    namespace NodeJS {
        interface Global {
            signup(): Promise<string[]>
        }
    }
}
let mongo: any;

beforeAll(async () => {
    //console.log('beforeAll testing instructions');

    process.env.JWT_KEY = 'dsdsdsa';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach( async () => {
    //console.log('beforeEach testing instructions');

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections ) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    //console.log('afterAll testing instructions');

    //await mongoose.mongo.stop();
    await mongoose.connection.close();

});


global.signup = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};