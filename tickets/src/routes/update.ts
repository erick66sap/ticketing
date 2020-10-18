import * as express from 'express';
import {Request, Response} from 'express';
import { Ticket } from '../models/model-ticket';
import { body } from 'express-validator';
import { validateRequest,
        NotFoundError,
        requireAuth,
        NotAuthorizedError,
        BadRequestError,
    } from '@bpx-training/common';
import { TicketUpdatedPublisher} from '../events/publishers/publisher-ticket-updated';
import {natsWrapper} from '../nats-wrapper';

const router =  express.Router();

router.put('/api/tickets/:id',requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('must be provided'),
    body('price')
        .isFloat({gt:0})
        .withMessage('must be greather than 0')
],
validateRequest
,async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }

    if (ticket.orderId){
        throw new BadRequestError('Can not edit a reserved ticket');
    }
    
    //set new values
    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    //update/save
    await ticket.save();

    //natsWrapper 
    // we need to capture the error when sending the event 
    // and resend the missing events
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.send(ticket);

})

export { router as updateTicketRouter};