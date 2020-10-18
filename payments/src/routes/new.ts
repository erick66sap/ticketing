import * as express from 'express';
import { Request, Response} from 'express';
import {body} from 'express-validator';
import {requireAuth,
        validateRequest,
        BadRequestError,
        NotFoundError,
        NotAuthorizedError,
        OrderStatus} from '@bpx-training/common';
import {Order} from '../models/model-order';
import {stripe} from '../stripe';
import {Payment} from '../models/model-payment';
import {PaymentCreatedPublisher} from '../events/publishers/publisher-payment-created';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
],
validateRequest,
async (req: Request, res: Response) => {
    const { token, orderId} = req.body;

    const order = await Order.findById(orderId);
    if(!order) {
        throw new NotFoundError();
    }
    
    if (order.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }

    if( order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Can not proceed as order is cancelled');
    }

    //Create charges
    const charge = await stripe.charges.create({
        currency:'usd',
        amount: order.price * 100, //stripe receive only cents! to handle 2 decimals
        source: token
    });
    //

    // keep records of payments
    const payment = Payment.build({
        orderId: orderId, 
        stripeId: charge.id
    });
    await payment.save();
    //

    //Pubish the event as order paid successfully
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });
    //

    res.status(201).send({id: payment.id});
    
    //res.status(201).send({success: true});

})

export {router as createChargeRouter};
