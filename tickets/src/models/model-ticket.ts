//const mongoose = require ('mongoose');
import * as mongoose from 'mongoose';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

// An interface that describes the properties that are required to create a ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// An interface tha describes the properties that a user pass
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;   //? means optional
}

// An interface that describes the properties that a user model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    userId: {type: String, required: true},
    orderId: {type: String, required: false}
    },
    { // modifying the json output
        toJSON:{
           transform(doc, ret) {
               ret.id = ret._id;
               delete ret._id;
               //delete ret.__v;
           } 
        }
    }
);

//versioning/concurrency
ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket',ticketSchema);

export {Ticket};