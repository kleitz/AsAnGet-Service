import {} from './dbHelper';


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



