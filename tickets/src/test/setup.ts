import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
//import { app }  from '../app';
//import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signup(): string[];
        }
    }
}

jest.mock('../nats-wrapper');

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
    
    jest.clearAllMocks();

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


global.signup = () => {
   // Build a JWT payload ( id, email }

   const payload = {
       //id: 'sdasdas', // instead will generate an id
       id: new mongoose.Types.ObjectId().toHexString(),
       email: 'test@test.com'
   }
   //Create a JWT
   const token = jwt.sign(payload, process.env.JWT_KEY!);

   //Build the session object { jwt: MY_JWT}
   const session = { jwt: token };

   // turn that session into jason
   const sessionJSON = JSON.stringify(session);

   // take json and encode to base64
   const base64 = Buffer.from(sessionJSON).toString('base64');

   //Return string that is the cookie with encode data
   return [`express:sess=${base64}`];
   // return cookie;
};