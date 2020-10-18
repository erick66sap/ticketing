import * as express from 'express';
import { Request, Response } from 'express';
import { requireAuth} from '@bpx-training/common';
import {Order} from '../models/model-order';

const router =  express.Router()

router.get('/api/orders', requireAuth ,async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    //console.log('Orders : ', orders);
    res.send(orders);

});

export {router as indexOrderRouter };