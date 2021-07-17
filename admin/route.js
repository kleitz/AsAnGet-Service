import express from 'express';
import {adminlogin} from './controller';
const router=express.Router();


router.post('/admin_login', adminlogin);





 export default router;