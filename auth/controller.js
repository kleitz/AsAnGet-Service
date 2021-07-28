import {getbyId} from './dbHelper';


/*getUser() 
 gets user id and from that user id gets userData 
 return userData
*/

export const getUser = async (req, res, next) => {
     
    try 
    {
        const user_id = req.body._id;
        console.log(user_id);
        const userData = await getbyId(user_id);
        console.log(userData);
        return res.status(200).json(userData);
    } 
    catch (error) 
    {
        return Promise.reject(error);
    }

}