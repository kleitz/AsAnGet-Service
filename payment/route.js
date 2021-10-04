import express from 'express';
import {add,update} from './controller';
const router=express.Router();


router.post('/add', add);
router.post('/update', update);

 export default router;