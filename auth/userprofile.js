import { myCars, edituserbyId, updateuserprofile, getprofilebyId, getuserjoineddays} from './dbHelper';
import {getuserratings} from '../ratings/dbHelper';


export const editprofile = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const userdata = await edituserbyId(user_id);
        
        return res.status(200).send({userdata});
    } catch (error) {
        next(error);
    }
}

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

