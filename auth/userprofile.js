import { myCars, edituserbyId, updateuserprofile, getprofilebyId} from './dbHelper';

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
        const {user_id,name ,age,phoneNum,email,homeaddress,officeaddress,imageUrl } = req.body;     
        
        const userdata = await updateuserprofile(user_id, name, age,phoneNum,email,homeaddress,officeaddress,imageUrl);
        return res.status(200).send({userdata});
    } catch (error) {
        next(error);
    }
}

export const getprofile = async (req, res, next) => {
    try {
        const {user_id,role } = req.body;     
        
        const cars = await getprofilebyId(user_id);
        return res.status(200).send({cars});
    } catch (error) {
        next(error);
    }
}


