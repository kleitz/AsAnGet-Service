import express from 'express';


import {createRide,findRide,bookRide,rideDetails} from './controller';
import{currentRide, completedRides, getRideOTP, verifyRideOTP, cancelRide, statusCompleted
       ,currentrideDetails,historyrideDetails,driverstartride} from './updatesrides';

const router=express.Router();

router.post('/create_ride',createRide);
router.post('/find_ride',findRide);
router.post('/book_ride',bookRide);
router.post('/ride_details',rideDetails);
router.post('/current_rides',currentRide);
router.post('/completed_rides',completedRides);
router.post('/ride_otp',getRideOTP);
router.post('/verify_otp',verifyRideOTP);
router.post('/cancel_ride',cancelRide);
router.post('/status_completed',statusCompleted);
router.post('/currentride_details',currentrideDetails);
router.post('/historyride_details',historyrideDetails);
router.post('/driverstart_ride',driverstartride);



router.get('/test3',(req, res, next)=>{
  res.status(200).send("test3");
});
 
 export default router;