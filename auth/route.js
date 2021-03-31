import express from 'express';
import uploadFile from '../helper/upload';
import {getTest, saveTest} from './controller';

const router=express.Router();

router.get('/test-get', async(req, res, next) => {
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

 export default router;