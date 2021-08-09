import express from 'express';
import {adminlogin, getRides,getRidesDetails} from './controller';
const router=express.Router();
import authenticator from '../helper/auth';


router.post('/admin_login', adminlogin);
router.post('/get_rides',authenticator.validateToken, getRides);

// router.get('/getRidesDetails', getRidesDetails);






 export default router;