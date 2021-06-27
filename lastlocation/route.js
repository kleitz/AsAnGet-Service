import express from 'express';
import {addlocation, getlocation} from './controller';
const router=express.Router();


router.post('/add_location', addlocation);
router.post('/get_location', getlocation);




 export default router;