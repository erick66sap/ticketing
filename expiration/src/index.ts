//import { DatabaseConnectionError } from './errors/error-database-connection';
import {DatabaseConnectionError} from '@bpx-training/common';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';
import { OrderCreatedListener} from './events/listeners/listerner-order-created';

const start = async () => {

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

        new OrderCreatedListener(natsWrapper.client).listen();

        
    }
    catch (err) {
        console.error(err);
        //throw new DatabaseConnectionError();
    }

} ;

start();
