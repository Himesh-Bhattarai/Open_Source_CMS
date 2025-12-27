import express from 'express';
import LoginRoute from '../Login/LoginRoute.js';
import LogoutRoute from '../Logout/LogoutRoute.js';
import RegisterRoute from '../Register/RegisterRoute.js';

const router = express.Router();

router.use('/login', LoginRoute);    
router.use('/logout', LogoutRoute); 
router.use('/register', RegisterRoute); 

export default router;
