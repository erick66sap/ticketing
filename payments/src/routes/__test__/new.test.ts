import * as request from 'supertest';
import {app} from '../../app';
import * as mongoose from 'mongoose';
import {Order, OrderStatus} from '../../models/model-order';
import { stripe} from '../../stripe';
import { Payment } from '../../models/model-payment';

//mocking stripe
//
//jest.mock('../../stripe');

it('return a error when purchasing an order that des not exists', async ()=>{
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: 'sdsasd',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('return a error when purchasing an order when user is not authorised', async ()=>{
    
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 10, 
        status: OrderStatus.Created
    });
    
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie',global.signup()) //this user lobal.signup() is different than order.userId
    .send({
        token: 'sdsasd',
        orderId: order.id
    })
    .expect(401);

});

it('return a error when purchasing an order when user is cancelled', async ()=>{
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        price: 10, 
        status: OrderStatus.Cancelled
    });

    await order.save();  

    await request(app)
    .post('/api/payments')
    .set('Cookie',global.signup(userId)) 
    .send({
        token: 'sdsasd',
        orderId: order.id
    })
    .expect(400);


});

it('return 204 with valid inputs,successfull payment -  stripe', async ()=>{

    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random()* 100);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        price: price, 
        status: OrderStatus.Created
    });

    await order.save();  

    await request(app)
    .post('/api/payments')
    .set('Cookie',global.signup(userId)) 
    .send({
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);

    const stripeCharges = await stripe.charges.list({
        limit: 50
    });

    console.log('list of charges ', stripeCharges);

    const stripeCharge = stripeCharges.data.find ( charge => {
        return charge.amount === price * 100
    });
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });

    expect(payment).not.toBeNull();
    

    //expectation when mocking
    //const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    //expect(chargeOptions.source).toEqual('tok_visa');
    //expect(chargeOptions.amount).toEqual(order.price*100);
    //expect(chargeOptions.currency).toEqual('usd');

});
