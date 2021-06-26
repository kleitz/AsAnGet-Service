import express from 'express';
import {addlocation} from './controller';
const router=express.Router();


router.post('/add_location', addlocation);




 export default router;