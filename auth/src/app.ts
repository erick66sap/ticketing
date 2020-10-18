import * as express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
const cookieSession = require('cookie-session');

import { currentuserRouter } from './routes/route-current-user';
import { signinRouter } from './routes/route-signin';
import { signoutRouter } from './routes/route-signout';
import { signupRouter } from './routes/route-signup';
//mport { errorHandler } from './middlewares/mw-error-handler';
//import { NotFoundError } from './errors/error-not-found';
import { errorHandler , NotFoundError } from '@bpx-training/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
    //this force to use https
    //secure: true
}));

//router handler - v1
//app.get('/api/users/currentuser',(req, res) => {
//    res.send('Hi there');
//});

//router handler - v2
app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//app.all('*', async (req, res, next) => {
//    next(new NotFoundError());
//});

//after install a package express-async-errors otherwise it will hang forever
app.all('*', async (req, res) => {
    throw new NotFoundError(); 
});

app.use(errorHandler);

export { app };