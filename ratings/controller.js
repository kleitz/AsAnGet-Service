import dbHelper from './dbHelper';
import {getuserratings} from './dbHelper';


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




export default ratings;