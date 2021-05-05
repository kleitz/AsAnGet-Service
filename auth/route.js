import express from 'express';
import uploadFile from '../helper/upload';
import {getTest, saveTest, getUser} from './controller';
import {facebookAuth} from './facebook';
import {googleAuth} from './google';
import {requireAuth} from './helper';
import { instagramAuth } from './instagram';

const router=express.Router();


router.post('/facebook_auth',facebookAuth);
router.post('/google_auth',googleAuth);
router.post('/instagram_auth',instagramAuth);
router.post('/userid',getUser);

router.get('/test-get-1', async(req, res, next) => {
    try {
        return res.status(200).send("hello1234");
    } catch (error) {
        next(error);
    }
 });

router.get('/test-get',requireAuth, async(req, res, next) => {
    try {
        const data = await getTest();
        return res.status(200).send(data);
    } catch (error) {
        next(error);
    }
 });


 router.post('/test-save', async(req, res, next) => {
    try {
        await saveTest(req.body);
        return res.status(200).send('success');
    } catch (error) {
        next(error);
    }
    
 });

 router.post('/test-file-upload', uploadFile.saveImage ,(req, res, next) => {
    return res.status(201).send('image save in gallery');
 });

 router.get('/test3',(req, res, next)=>{
  res.status(200).send("test3");
 });
 
 export default router;