import { myCars, edituserbyId, updateuserprofile, getprofilebyId} from './dbHelper';

export const editprofile = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const userdata = await edituserbyId(user_id);
        console.log(userdata);
        return res.status(200).send({name:userdata.name, url:userdata.url, email:userdata.email?? '',
            phoneNum:userdata.phoneNum?? '', homeaddress:userdata.homeaddress?? '',officeaddress:userdata.officeaddressuserdata?? '', 
            age : userdata.age?? ''});
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

export const getdriverprofile = async (req, res, next) => {
    try {
        const {user_id,role } = req.body;     
        
        const data = await getprofilebyId(user_id);
        return res.status(200).send({data});
    } catch (error) {
        next(error);
    }
}
export const getpassengerprofile = async (req, res, next) => {
    try {
        const {user_id,role } = req.body;     
        const data = await getprofilebyId(user_id);
        return res.status(200).send({data});
    } catch (error) {
        next(error);
    }
}

