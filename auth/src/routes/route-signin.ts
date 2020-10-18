import * as express from 'express';
import * as session from 'express-session';
import { Request, Response } from 'express';
import { body } from 'express-validator';
//import { validateRequest } from '../middlewares/mv-validate-request';
//import { BadRequestError} from '../errors/error-bad-request';
import {validateRequest, BadRequestError } from '@bpx-training/common';

import { User } from '../models/model-user';

import { PasswordManager } from '../services/svc-password';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('must supply a passwrod')
    ],
    validateRequest,
    async (req: Request, res: Response ) => {
        const { email, password } = req.body;
        const existingUser =  await User.findOne({email});
        if (!existingUser) {
            throw new BadRequestError('Invalid Credentials 1');
        }

        const passwordsMatch =  await PasswordManager.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid Credentials 2:');
        }

        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            }, 
             process.env.JWT_KEY
            );
        
        //session.jwt = userJwt;
        req["session"].jwt = userJwt;

        //req.session = {
        //    jwt: userJwt,
        //    id: ''
        //};

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };