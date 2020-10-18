import * as mongoose from 'mongoose';
import { OrderStatus } from '@bpx-training/common';
import { TicketDoc } from './model-ticket';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

export {OrderStatus};

// An interface that describes the properties that are required to create a user
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiredAt: Date;
    ticket: TicketDoc;
}

// An interface tha describes the properties that a user pass
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiredAt: Date;
    ticket: TicketDoc;
    version: number; // for concurrency/versioning
}

// An interface that describes the properties that a user model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    status: {type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created},
    expiredAt: {type: mongoose.Schema.Types.Date, required: false},
    ticket: {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Ticket'},
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
orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);
//
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema);

export {Order};