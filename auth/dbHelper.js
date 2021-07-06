import model from './model';

export const getbyId = async(user_id) => {
    try {
        const existUser = await model.findOne({ _id  : user_id });
        return {existUser};
    } catch (error) {
        return Promise.reject(error);
    }
}

export const edituserbyId = async(user_id) => {
    try {
        const existUser = await model.findOne({ _id  : user_id });
        return {name:existUser.name, url:existUser.imageUrl, email:existUser.email,
            phoneNum:existUser.phoneNum, homeaddress:existUser.homeaddress,officeaddress:existUser.officeaddress, 
            age : existUser.age
         };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateuserprofile = async(body ,files) => {
    try {
        
       console.log(files);
       await model.updateOne({"_id": body.user_id},
        { $set: { "name" : body.name , "age" : body.age , "phoneNum" : body.phoneNum , "email" : body.email
        , "homeaddress" : body.homeaddress , "officeaddress" : body.officeaddress , 
        "imageUrl" : `http://${process.env.serverIPAddress}:${process.env.PORT}/img/${files[0].originalname}`} 
    })
    return ;
    } catch (error) {
        return Promise.reject(error);
    }
}
export const addUserCar = async(newCar) => {
    try {
        const existUser = await model.findOne({ _id  : newCar.user_id });
        existUser.cars.push(newCar);
        await existUser.save();
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const myCars = async(user_id) => {
    try {
        const existUser = await model.findOne({ _id: user_id });
        if(existUser){
            const cars = existUser.cars;
            return cars;
        }
        return null;
        
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getprofilebyId = async(user_id,role) => {
    try {
        const existUser = await model.findOne({ _id  : user_id });
        console.log(existUser);
        return {name:existUser.name, url:existUser.imageUrl?? '', homeaddress : existUser.homeaddress?? '' , 
               officeaddress : existUser.officeaddress?? '', cars: existUser.cars?? '' };
    } catch (error) {
        return Promise.reject(error);
    }
}