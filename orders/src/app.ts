import * as express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
const cookieSession = require('cookie-session');

import { indexOrderRouter } from './routes/index';
import { showOrderRouter} from './routes/show';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';

import { errorHandler , NotFoundError , currentUser } from '@bpx-training/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError(); 
});

app.use(errorHandler);

export { app };