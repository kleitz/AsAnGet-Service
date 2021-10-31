import express from 'express';
import { add, getAll, callback, getByOrderId, getByRideId } from './controller';
const router = express.Router();


router.post('/add', add);
router.get('/getAll', getAll);
router.post('/call_back', callback);
router.post('/getByOrderId', getByOrderId);
router.post('/getByRideId', getByRideId);


export default router;