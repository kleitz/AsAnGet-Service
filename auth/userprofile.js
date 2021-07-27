import { myCars, edituserbyId, updateuserprofile, getprofilebyId} from './dbHelper';
import {getuserratings} from '../ratings/dbHelper';

/*editprofile() is used to edit profile  of the user by id*/
export const editprofile = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const userdata = await edituserbyId(user_id);
        console.log(userdata);
        return res.status(200).send({userdata});
    } catch (error) {
        next(error);
    }
}
/*updateprofile() is used to update profile  of the user*/
export const updateprofile = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log(req.files);
        const  userdata = await updateuserprofile(req.body, req.files);
        
        //const userdata = await updateuserprofile(user_id, name, age,phoneNum,email,homeaddress,officeaddress,imageUrl);
        return res.status(200).send({"ProfileUpdated":"Success"});
    } catch (error) {
        next(error);
    }
}
/*getdriverprofile() is used to get driver profile */
export const getdriverprofile = async (req, res, next) => {
    try {
        const {user_id,role } = req.body;     
        
        const data = await getprofilebyId(user_id);
        const rating = await getuserratings(user_id, role);
        return res.status(200).send({data,rating});
    } catch (error) {
        next(error);
    }
}

/*getpassengerprofile() is used to get passenger profile */
export const getpassengerprofile = async (req, res, next) => {
    try {
        const {user_id,role } = req.body;     
        const data = await getprofilebyId(user_id);
        const rating = await getuserratings(user_id, role);
        return res.status(200).send({data,rating});
        
    } catch (error) {
        next(error);
    }
}

