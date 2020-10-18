//const mongoose = require ('mongoose');
import * as mongoose from 'mongoose';
import {Order, OrderStatus} from './model-order';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

// An interface that describes the properties that are required to create a user
interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    //userId: string;
    //version: string;
}

// An interface tha describes the properties that a user pass
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved() : Promise<boolean>;
    //userId: string;
    //version: string;
}

// An interface that describes the properties that a user model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {id: string, version: number}) : Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true, min: 0}
    //userId: {type: String, required: true},
    //version: {type: String, required: true}
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

//ticketSchema.pre('save', function(done) {
    //this the following line we tell ts to not to validate $where 
    // @ts-ignore
//    this.$where = {
//        version: this.get('version') -1
//    };
//    done();
//});

ticketSchema.statics.findByEvent= ( event: {id:string, version:number})=>{
    return Ticket.findOne({
        _id: event.id,
        version: event.version -1
    })
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};

ticketSchema.methods.isReserved = async function() {
    // this = is the ticket document that we just called 'isreserved 
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        }
    });
    //console.log(' order exists ? : ', !!existingOrder);

    return !!existingOrder; // double negative
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket',ticketSchema);

export {Ticket};