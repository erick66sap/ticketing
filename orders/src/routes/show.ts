import * as express from 'express';
import { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth} from '@bpx-training/common';
import {Order} from '../models/model-order';

const router =  express.Router()

router.get('/api/orders/:orderId', requireAuth,async (req: Request, res: Response) => {
    const order = await (await Order.findById(req.params.orderId)).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }
    if(order.userId!== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }


    res.send(order);
   // console.log('Order : ', order );
});

export {router as showOrderRouter };