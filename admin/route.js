import express from 'express';
import {adminlogin, getRides,getRidesDetails} from './controller';
const router=express.Router();


router.post('/admin_login', adminlogin);
router.post('/get_rides', getRides);

// router.get('/getRidesDetails', getRidesDetails);






 export default router;