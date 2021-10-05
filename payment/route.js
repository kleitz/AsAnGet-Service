import express from 'express';
import {add,update,getAll,callback} from './controller';
const router=express.Router();


router.post('/add', add);
router.post('/update', update);
router.get('/getAll', getAll);
router.post('/call_back', callback);

 export default router;