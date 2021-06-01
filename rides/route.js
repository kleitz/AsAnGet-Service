import express from 'express';


import {createRide,findRide,bookRide,currentRide,completedRide,rideDetails} from './controller';

const router=express.Router();

router.post('/create_ride',createRide);
router.post('/find_ride',findRide);
router.post('/book_ride',bookRide);
router.post('/current_ride',currentRide);
router.post('/completed_ride',completedRide);
router.post('/ride_details',rideDetails);






 router.get('/test3',(req, res, next)=>{
  res.status(200).send("test3");
 });
 
 export default router;