import express from 'express';


import {createRide,findRide,bookRide} from './controller';

const router=express.Router();

router.post('/create_ride',createRide);
router.post('/find_ride',findRide);
router.post('/book_ride',bookRide);


 router.get('/test3',(req, res, next)=>{
  res.status(200).send("test3");
 });
 
 export default router;