import express from 'express';
import LoginRoute from '../Login/LoginRoute.js';
import LogoutRoute from '../Logout/Logout.js';
import RegisterRoute from '../Register/Register.js';

const router = express.Router();

router.use('/login', LoginRoute);    
router.use('/logout', LogoutRoute); 
router.use('/register', RegisterRoute); 

export default router;
