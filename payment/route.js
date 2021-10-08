import express from 'express';
import {add,getAll,callback,getByOrderId} from './controller';
const router=express.Router();


router.post('/add', add);
router.get('/getAll', getAll);
router.post('/call_back', callback);
router.post('/getByOrderId', getByOrderId);

 export default router;