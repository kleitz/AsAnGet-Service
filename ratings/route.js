import express from 'express';
import controller from './controller'
import {add,userratings,ratingsReview} from './controller';
const router=express.Router();


router.post('/add', add);
router.post('/userratings', userratings);
// router.post('/ratingsReview', ratingsReview);
router.get('/getRatingsReview',  function(req, res, next) {
    return controller.getRatingsReview().then((results) => {
        return res.status(200).json({ data: results });
    }).catch((err) => next(err));
});

 export default router;