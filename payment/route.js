import express from 'express';
import {add,update,getAll} from './controller';
const router=express.Router();


router.post('/add', add);
router.post('/update', update);
router.get('/getAll', getAll);

 export default router;