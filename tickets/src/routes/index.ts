import * as express from 'express';
import {Request, Response} from 'express';
import { Ticket } from '../models/model-ticket';

const router =  express.Router();

router.get('/api/tickets',async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined
    });

    res.send(tickets);

})

export { router as indexTicketRouter};