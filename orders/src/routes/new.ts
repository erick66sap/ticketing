import * as express from 'express';
import { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError} from '@bpx-training/common';
import { body } from 'express-validator';
import * as mongoose from 'mongoose';
import {Order} from '../models/model-order';
import {Ticket} from '../models/model-ticket';
import {OrderCreatedPublisher} from '../events/publishers/publisher-order-created';
import {natsWrapper} from '../nats-wrapper';

const router =  express.Router();

const EXPIRATION_WINDOW_SECONDS =  1*60; //seconds // 1*60 -> minutes

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string)=> mongoose.Types.ObjectId.isValid(input))
        .withMessage('tikectId mush be provided')
],
validateRequest,
async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    
    //find the ticket the user user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        //console.log('ticket does not exist');
        throw new NotFoundError();
    }

    //make sure the ticket is not alredy reserved
    //run query to look all orders to find the one with the  ticker we just found
    // and order status is not cancelled
    // if we find an order it means that the ticket is reserved!
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        //console.log('ticket is already reserved log ');
        throw new BadRequestError('Ticket is already reserved');
    }

    //calculate an expration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); 

    //build the order and ssave in db
    const order =  Order.build({
        userId: req.currentUser.id,
        status: OrderStatus.Created,
        expiredAt: expiration,
        //ticket: ticket, //or ticket
        ticket
    });
    await order.save();
    //console.log('Order saved : ', order );
    // publish an event indicating the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiredAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order);

});

export {router as newOrderRouter };