import * as express from 'express';
//import { currentUser } from '../middlewares/mw-current-user';
import  {currentUser}  from '@bpx-training/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res ) => {
    console.log('running currentuser');
    //res.send( null );
    //res.send({currentuser: req["currentUser"] || null });
    res.send({currentuser: req.currentUser || null });
    //res.send('Hi there');
});

export { router as currentuserRouter };