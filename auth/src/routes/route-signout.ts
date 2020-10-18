import * as express from 'express';
import * as session from 'express-session';

const router = express.Router();

router.post('/api/users/signout', (req, res ) => {
    //session.jwt = null;
    req.session = null;
    res.send('Hi there signout');
    //res.send({});
});

export { router as signoutRouter };