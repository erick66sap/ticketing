const { default: Link } = require("next/link")

const LandingPage = ({currentuser, tickets}) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        );
    });
    return (
        <div>
            <h1>
                Tickets
            </h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    );
    //console.log(tickets);
    //return currentuser? (<h1> You are signed in</h1> ): ( <h1>You are NOT signed in</h1> )
};
LandingPage.getInitialProps = async (context, client, currentuser) => {
    const { data } = await client.get('/api/tickets');
    return {tickets: data};  
    //return {};    
};
export default LandingPage;

//this does not work because it is within the container
//const response = await axios.get('/api/users/currentuser');   
//if we add the whole url it will work because ngnix will handle it. BETTER!!!
//const response = await axios.get('http://node-ticketing.bpx-training.info/api/users/currentuser'); 
//or
//using the kubernetes service http://auth-svc/...  BAD!!! -> we need to habdle many services.
//or for internal communication
// http://<service name>.<namespace>.svc.cluster.local
// http://auth-svc.node-ticketing.svc.cluster.local
// we can communicate with nginx
// http://k8-ingress-nginx-ingress.k8-ingress.svc.cluster.local
//const response = await axios.get('http://k8-ingress-nginx-ingress.k8-ingress.svc.cluster.local/api/users/currentuser'); 

//if (typeof window === 'undefined') {
// we are on the server
// we need on include the complete url
//   console.log('running on the server');
//   const {data} = await axios.get('http://k8-ingress-nginx-ingress.k8-ingress.svc.cluster.local/api/users/currentuser', {
//       headers: req.headers
//       //headers: {Host: 'node-ticketing.bpx-training.info'}
//   }); 
//   return data;
//} else {
//we are on the browser
//do not need to include the full url
//   console.log('running on the browser');
//   const {data} = await axios.get('/api/users/currentuser'); 
//   return data;
//}

