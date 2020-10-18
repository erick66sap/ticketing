import * as mongoose from 'mongoose';
import { app }  from "./app";
//import { DatabaseConnectionError } from './errors/error-database-connection';
import {DatabaseConnectionError} from '@bpx-training/common';

const start = async () => {
    console.log('Starting app auth');
    
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology : true,
            useCreateIndex: true
        });
        console.log('connected to mongodb - auth');
    }
    catch (err) {
        //console.error(err);
        throw new DatabaseConnectionError();
    }

    app.listen(3000,() => {
        console.log('Listening on port 3000!!!!');
    });
} ;

start();
