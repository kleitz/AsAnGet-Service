import express from 'express';


import {createRide} from './createride';

const router=express.Router();

router.post('/create_ride',createRide);

 router.get('/test3',(req, res, next)=>{
  res.status(200).send("test3");
 });
 
 export default router;