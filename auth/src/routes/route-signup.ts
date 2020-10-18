//const express = require('express');
import * as express from 'express';
import * as session from 'express-session';
import { Request, Response} from 'express';
import { body } from 'express-validator';
//import { validationResult } from 'express-validator';
//import { RequestValidationError } from '../errors/request-validation-error';
//import { validateRequest } from '../middlewares/mv-validate-request';
//import { BadRequestError } from '../errors/error-bad-request';
import { validateRequest, BadRequestError } from '@bpx-training/common';

//import { DatabaseConnectionError } from '../errors/error-database-connection';

import { User } from '../models/model-user';
import * as jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min:4, max: 20})
        .withMessage('Password must be between 4 to 20 characters')

] ,
validateRequest,
async (req: Request , res: Response ) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new BadRequestError('Email in use');
    }

    console.log('Creating a user ....')
    const user = User.build ( {email, password});
    await user.save();
    
    //generate jwt
    const userJwt = jwt.sign(
        {
            id: user.id,
            email: user.email
        }, //JWT Signing Key, check readme.md, we will get it from the environment variable sent by kubectl deployment
            process.env.JWT_KEY
        );

    // store it on session object
    //check it jwt in the cookie field on https://www.base64decode.org
    //check the jwt on https://jwt.io
     
    req["session"].jwt= userJwt;
    //session.jwt = userJwt;
    //req.session = {
    //    jwt: userJwt
    //};

    res.status(201).send(user);
    
    //throw new Error('Error connecting to database');
    //throw new DatabaseConnectionError();
    //res.send({});
});

export { router as signupRouter };