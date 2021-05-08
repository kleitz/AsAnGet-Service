import express from 'express';


import {createRide,findRide} from './controller';

const router=express.Router();

router.post('/create_ride',createRide);

router.post('/find_ride',findRide);

 router.get('/test3',(req, res, next)=>{
  res.status(200).send("test3");
 });
 
 export default router;