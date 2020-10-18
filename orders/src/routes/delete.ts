import * as express from 'express';
import { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@bpx-training/common';
import { Order, OrderStatus} from '../models/model-order';

import {OrderCancelledPublisher} from '../events/publishers/publisher-order-cancelled';
import {natsWrapper} from '../nats-wrapper';

const router =  express.Router()
// this can be PUT or PATCH
router.delete('/api/orders/:orderId', requireAuth ,async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    
    order.status = OrderStatus.Cancelled;
    await order.save();
    
    //publish an event saying thi was cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id}
    });

    res.status(204).send(order);
    //console.log('');
});

export {router as deleteOrderRouter };