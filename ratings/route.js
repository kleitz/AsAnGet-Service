import express from 'express';
import {add,userratings} from './controller';
const router=express.Router();


router.post('/add', add);
router.post('/userratings', userratings);



 export default router;