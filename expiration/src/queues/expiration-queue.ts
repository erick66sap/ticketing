import * as Queue from 'bull';
import {ExpirationCompletedPublisher} from '../events/publishers/publisher-expiration-completed';
import {natsWrapper} from '../nats-wrapper';

interface PayLoad {
    orderId: string
};

const expirationQueue = new Queue<PayLoad>('order-expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    console.log('Need to check if the order was completed ');
    //console.log('I want to publish an expiration:complete event for orderId',job.data.orderId);
    
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });

});

export { expirationQueue} ;


