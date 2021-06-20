import express from 'express';
import {add} from './controller';
const router=express.Router();


router.post('/add', add);


 export default router;