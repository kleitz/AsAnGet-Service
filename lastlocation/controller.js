import {addlastlocation} from './dbHelper';


export const addlocation = async (req, res, next) => {  
    try {  
       const data = await addlastlocation(req.body);
        return res.status(200).json({ data: "Success" });
    } catch (err) {
        return next(err);
    }
}


