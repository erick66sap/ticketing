import * as axios from 'axios';

export default ({req }) => {
    if (typeof window === 'undefined') {
        // we are on the server
        return axios.create ( {
            baseURL: 'http://k8-ingress-nginx-ingress.k8-ingress.svc.cluster.local',
            headers: req.headers
        });

    } else {
        // we are on the browser
        return axios.create ( {
            baseURL: '/'
        });
    }
};