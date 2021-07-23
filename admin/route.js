import express from 'express';
import {adminlogin, getRides} from './controller';
const router=express.Router();


router.post('/admin_login', adminlogin);
router.post('/get_rides', getRides);





 export default router;