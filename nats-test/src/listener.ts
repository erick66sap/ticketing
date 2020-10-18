import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './listeners/listener-ticket-created';

console.clear();
const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url: "http://localhost:4222"
});

stan.on('connect',()=> {
    console.log('listener connected to NATS')

    stan.on('close',()=>{
        console.log('NATS connection close');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});


//interupt program
process.on('SIGINT',()=> stan.close());
//Terminate program
process.on('SIGTERM',()=> stan.close());