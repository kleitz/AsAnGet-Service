import express from 'express';
import uploadFile from '../helper/upload';
import {getTest, saveTest, getUser} from './controller';
import {facebookAuth} from './facebook';
import {googleAuth} from './google';
import {requireAuth} from './helper';
import { instagramAuth } from './instagram';
import {addCar, myCar, userCars, removeCar , getcar ,updatecar} from './cars';
import {editprofile, updateprofile,getdriverprofile, 
    getpassengerprofile, getNoOfjoindays,userdata, 
    getAll, updateFireBaseTopic} from './userprofile';
const router=express.Router();
import upload from '../helper/upload';


router.post('/facebook_auth',facebookAuth);
router.post('/google_auth',googleAuth);
router.post('/instagram_auth',instagramAuth);
router.post('/userid',getUser);
router.post('/add_car',addCar);
router.post('/my_car',myCar);
router.post('/user_car',userCars);
router.post('/edit_car',getcar);
router.post('/update_car',updatecar);
router.post('/edit_profile',editprofile);
router.post('/update_profile', upload.saveImage, updateprofile);
router.post('/get_driverprofile',getdriverprofile);
router.post('/get_passengerprofile',getpassengerprofile);
router.post('/get_joineddays',getNoOfjoindays);
router.post('/get_userdata',userdata);
router.get('/getAll', getAll);
router.post('/delete_car', removeCar);
router.post('/update_firebaseTopic', updateFireBaseTopic);



 
 export default router;