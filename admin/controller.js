import {getrequestrides,getrequestridesdetails} from './dbHelper';


export const adminlogin = async (req, res, next) => {  
    try {  

        const {username, password  } = req.body;
        console.log(username);
        console.log(password);
        if(username == process.env.adminUsername && password == process.env.adminPassword){
        return res.status(200).json({ data: "Success" });

        }
       else{
        return res.status(200).json({ data: "Invalid Credentials" });
         
       }
    } catch (err) {
        return next(err);
    }
}


export const getRides = async (req, res, next) => {  
    try {  

        const {username, password  } = req.body;
        const data = await getrequestrides();
        return res.status(200).json({ data});

    } catch (err) {
        return next(err);
    }
}
/*
export const getRidesDetails = async (req, res, next) => {  
    try {  

        const {username, password  } = req.body;
        const data = await getrequestrides();
      
        return res.status(200).json({ data});

    } catch (err) {
        return next(err);
    }
}
*/