import * as mongoose from 'mongoose';
import { OrderStatus } from '@bpx-training/common';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

export {OrderStatus};

// An interface that describes the properties that are required to create a user
interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

// An interface tha describes the properties that a user pass
interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

// An interface that describes the properties that a user model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    version: {type: Number, required: true},
    userId: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created},
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
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema);

export {Order};