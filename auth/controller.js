import {getTestFromDb,saveTestFromDb} from './dbHelper';
import model from './model';

export const getTest = async () => {
    try {
        await getTestFromDb();
    } catch (error) {
        return Promise.reject(error);
    }
}

export const saveTest = async (body) => {
    try {
        await saveTestFromDb(body);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getUser = async (req, res, next) => {
     
    try 
    {
        const user_id = req.body._id;
        console.log(user_id);
        const existUser = await model.findOne({ _id  : user_id });
        console.log(existUser);
        return res.status(200).json({name:existUser.name,id:existUser._id,url:existUser.imageUrl,email:existUser.email});
    } 
    catch (error) 
    {
        return Promise.reject(error);
    }

}