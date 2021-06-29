import {addlastlocation , getalllocation} from './dbHelper';


export const addlocation = async (req, res, next) => {  
    try {  
       const data = await addlastlocation(req.body);
        return res.status(200).json({ data: "Success" });
    } catch (err) {
        return next(err);
    }
}

export const getlocation = async (req, res, next) => {  
    try {  
       const data = await getalllocation(req.body.userId);
       if(data){
       return res.status(200).json({Locations : data});
        
       }
       else{
       return res.status(200).json({Locations : []});

       }
    } catch (err) {
        return next(err);
    }
}


