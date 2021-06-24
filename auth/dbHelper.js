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

export const updateuserprofile = async(user_id,name, age, phoneNum, email, homeaddress, officeaddress, imageUrl) => {
    try {
     
       await model.updateOne({"_id":user_id},
        { $set: { "name" : name, "age" : age , "phoneNum" : phoneNum , "email" : email
        , "homeaddress" : homeaddress , "officeaddress" : officeaddress , "imageUrl" : imageUrl} 
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
        const cars = existUser.cars;
        
        return cars;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getprofilebyId = async(user_id,role) => {
    try {
        const existUser = await model.findOne({ _id  : user_id });

        return {name:existUser.name, url:existUser.imageUrl, homeaddress : existUser.homeaddress , 
               officeaddress : existUser.officeaddress, cars: existUser.cars };
    } catch (error) {
        return Promise.reject(error);
    }
}