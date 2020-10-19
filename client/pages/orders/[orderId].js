import { useEffect, useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import {useRequest} from '../../hooks/use-request';
import {useRouter} from 'next/router';

const OrderShow =({order, currentuser})=>{
    const [timeLeft, setTimeLeft] = useState(0);
    const router = useRouter();
    const { doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => {
            console.log(payment);
            //clearInterval(timerId);
            router.push('/orders')
        }
    });

    useEffect(()=>{
        const findTimeLeft = () => {
            const msLeft =  new Date(order.expiredAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };

        findTimeLeft(); //for the first time
        const timerId = setInterval(findTimeLeft,1000); //after timer

        return () => {  // () will execute only when we leave the page
            clearInterval(timerId);
        };

    }, [order]); 

    if(timeLeft<0) {
        return (
            <div>Order Expired</div>
        );
    }
    return (
        //<div>OrderShow</div>
        <div> Time left to pay: {timeLeft} 
        
        <StripeCheckout
            token={(token) => {
                //console.log(token)
                doRequest({token: token.id })
            }}
            stripeKey="pk_test_51HdQQ9CVRfokEnd9ZQ1xgmMQmBY3zdW6H177SMbJ8ZoulCSCvFUieuJLGlZb8FZiWT9qugUYEiS1esTOkEOv2mmp00XWaMBJBd"
            amount={order.ticket.price * 100} //convert it to cents
            email={currentuser.email}
        >
        </StripeCheckout>
        {errors}
        </div>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const { data} = await client.get(`/api/orders/${orderId}`);

    return { order: data};
};
export default OrderShow;