import * as mongoose from 'mongoose';
import { app }  from "./app";
//import { DatabaseConnectionError } from './errors/error-database-connection';
import {DatabaseConnectionError} from '@bpx-training/common';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';
import {TicketCreatedListener} from './events/listeners/listener-ticket-created';
import {TicketUpdatedListener} from './events/listeners/listener-ticket-updated';
import {ExpirationCompletedListener} from './events/listeners/listener-expiration-completed';
import { PaymentCreatedListener } from './events/listeners/listener-payment-created';


const start = async () => {
    console.log('Starting app - training');

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    try {
        //await natsWrapper.connect('ticketing',
        //        randomBytes(4).toString('hex'),
        //        'http://natss-svc:4222');
        
        await natsWrapper.connect(
                process.env.NATS_CLUSTER_ID,
                process.env.NATS_CLIENT_ID,
                process.env.NATS_URL);

        natsWrapper.client.on('close',()=>{
            console.log('NATS connection close');
            process.exit();
        });
        //interupt program
        process.on('SIGINT',()=> natsWrapper.client.close());
        //Terminate program
        process.on('SIGTERM',()=> natsWrapper.client.close());

        //instanciate listeners
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen(); 
        new ExpirationCompletedListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology : true,
            useCreateIndex: true
        });
        console.log('connected to mongodb - orders');
    }
    catch (err) {
        //console.error(err);
        throw new DatabaseConnectionError();
    }

    app.listen(3000,() => {
        console.log('Listening on port 3000!!!!');
    });
} ;

start();
