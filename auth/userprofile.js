import { myCars, edituserbyId, updateuserprofile, getprofilebyId, getuserjoineddays, getbyId} from './dbHelper';
import {getuserratings} from '../ratings/dbHelper';
import {tokenForUser} from './helper';

/*editprofile() is used to edit profile  of the user by id*/
export const editprofile = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const userdata = await edituserbyId(user_id);
        
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

export const getNoOfjoindays = async (req, res, next) => {
    try {
        const {user_id} = req.body;     
        const days = await getuserjoineddays(user_id);
        
        return res.status(200).send({"days":days});
        
    } catch (error) {
        next(error);
    }
}

export const userdata = async (req, res, next) => {
    try {
        const {user_id} = req.body;     
        const existUser = await getbyId(user_id);
        
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.existUser.name,id:existUser.existUser._id,url:existUser.existUser.imageUrl,email:existUser.existUser.email, cars:existUser.existUser.cars.length});
        
    } catch (error) {
        next(error);
    }
}