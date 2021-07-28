import dbHelper from './dbHelper';
import {getuserratings,getRatingsReview} from './dbHelper';


const ratings= {};

export const add = async (req, res, next) => {  
    try {  
       await dbHelper.save(req.body);
        return res.status(200).json({ data: "saved" });
    } catch (err) {
        return next(err);
    }
}
export const userratings = async (req, res, next) => {
    try {
        
        const { user_id,role } = req.body;
        const rideDetails = await getuserratings(user_id,role );
        return res.status(200).send(rideDetails);
    } catch (error) {
        next(error);
    }
}
/*
export const ratingsReview = async (req, res, next) =>{
    try{
        await getRatingsReview(req.body).then(results);
        return res.status(200).json({ data: results });

    }catch (err){
        return next (err);
    }
}
*/
ratings.getRatingsReview = async (rate,review) => {
    try {
        return await dbHelper.getRatingsReview(rate,review);
    } catch (err) {
        return Promise.reject(err);
    }
}



export default ratings;