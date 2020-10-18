import * as express from 'express';
import {Request, Response} from 'express';
import { requireAuth , validateRequest } from '@bpx-training/common';
import { body } from 'express-validator';
import { Ticket } from '../models/model-ticket';
import { TicketCreatedPublisher} from '../events/publishers/publisher-ticket-created';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title')
        .not()
        .notEmpty()
        .withMessage('title is required'),
    body('price')
        .isFloat({ gt: 0})
        .withMessage('Price must be greater than cero')
],
validateRequest, 
async (req: Request, res: Response) => {
    const {title, price} = req.body;
    //being save a ticket
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser.id
    });
    await ticket.save();
    //end of save a ticket
    

    //natsWrapper
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).send(ticket);
    //res.sendStatus(200);
});

export { router as createTicketRouter }