import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
//import { app }  from '../app';
//import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signup(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper');

let mongo: any;
//used to access stripe
process.env.STRIPE_KEY = 'sk_test_51HdQQ9CVRfokEnd9djPqO3GZJTh7QFFXzBLNOKCHBm5hv3LuyZFgPGfwafU4dWfYAuSBjCqyy56fkTSrGWYtBi2I00ioosgrMR';

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


global.signup = (id?: string) => {
   // Build a JWT payload ( id, email }

   const payload = {
       //id: 'sdasdas', // instead will generate an id
       id: id || new mongoose.Types.ObjectId().toHexString(), //if id is not provided then generate an id 
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