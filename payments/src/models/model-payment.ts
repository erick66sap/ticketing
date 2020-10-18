import * as mongoose from 'mongoose';
//import { OrderStatus } from '@bpx-training/common';
//import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

//export {OrderStatus};

// An interface that describes the properties that are required to create a user
interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

// An interface tha describes the properties that a user pass
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

// An interface that describes the properties that a user model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
    orderId: {type: String, required: true},
    stripeId: {type: String, required: true},
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
//orderSchema.set('versionKey','version');
//orderSchema.plugin(updateIfCurrentPlugin);
//
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment',paymentSchema);

export {Payment};