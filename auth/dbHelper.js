import { Model } from 'mongoose';
import model from './model';

export const getAllUsers = async () => {
    try {
        const users = await model.find({});
        return users;
    } catch (error) {
        return Promise.reject(error);
    }
}
/*getbyId() used to get existing user by userId*/
export const getbyId = async (user_id) => {
    try {
        const existUser = await model.findOne({ _id: user_id });
        return { existUser };
    } catch (error) {
        return Promise.reject(error);
    }
}
export const getuserjoineddays = async (user_id) => {
    try {
        const existUser = await model.findOne({ _id: user_id });
        const createDate = existUser.createdDate;
        const tdate = new Date();
        const diff = (tdate - createDate) / (86400000);
        const str = String(diff);
        const days = str.slice(0, 2);

        return days;
    } catch (error) {
        return Promise.reject(error);
    }
}
export const edituserbyId = async (user_id) => {
    try {
        const existUser = await model.findOne({ _id: user_id });


        return {
            name: existUser.name, url: existUser.imageUrl, email: existUser.email,
            phoneNum: existUser.phoneNum, homeaddress: existUser.homeaddress, officeaddress: existUser.officeaddress,
            age: existUser.age
        };
    } catch (error) {
        return Promise.reject(error);
    }
}
/*updateuserprofile() is used to update user profile */
export const updateuserprofile = async (body, files) => {
    try {
        let profileUrl = '';
        let dlImageUrl = '';
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let imageName = element.originalname;
            if(imageName.startsWith("asanget_profile")){
                profileUrl = imageName;
            }
            else if(imageName.startsWith("asanget_dl")){
                dlImageUrl = imageName;
            }    
        }
        await model.updateOne({ "_id": body.user_id },
            {
                $set: {
                    "name": body.name, "age": body.age, "phoneNum": body.phoneNum, "email": body.email
                    , "homeaddress": body.homeaddress, "officeaddress": body.officeaddress,
                    "imageUrl": `http://${process.env.serverIPAddress}:${process.env.PORT}/img/${profileUrl}`,
                    "driveryLicenceUrl": `http://${process.env.serverIPAddress}:${process.env.PORT}/img/${dlImageUrl}`

                }
            })
        return;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateUserFireBaseTopic = async (body) => {
    try {
        await model.updateOne({ "_id": body.userId },
            {
                $set: {
                    "firebaseTopic": body.fcmToken
                }
            })
        return;
    } catch (error) {
        return Promise.reject(error);
    }
}
/* addUserCar() is used to add a new car to user profile  */
export const addUserCar = async (newCar) => {
    try {
        const existUser = await model.findOne({ _id: newCar.user_id });
        existUser.cars.push(newCar);
        await existUser.save();
        return;
    } catch (error) {
        return Promise.reject(error);
    }
}
/*myCars() is used to let the user see his cars */
export const myCars = async (user_id) => {
    try {
        const existUser = await model.findOne({ _id: user_id });
        if (existUser) {
            const cars = existUser.cars;
            return cars;
        }
        return null;

    } catch (error) {
        return Promise.reject(error);
    }
}
/* getprofilebyId() is used to get user's profile*/
export const getprofilebyId = async (user_id) => {
    try {
        const existUser = await model.findOne({ _id: user_id });
        return {
            name: existUser.name,
            imageUrl: existUser.imageUrl ?? '',
            homeAddress: existUser.homeaddress ?? '',
            officeAddress: existUser.officeaddress ?? '',
            cars: existUser.cars ?? '',
            phoneNum: existUser.phoneNum,
            email: existUser.email
        };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteCar = async (userId, carId) => {
    try {
        await model.updateOne( {'_id':userId},
        {$pull:{cars:{_id:carId}}});
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateCarCompleteCount = async (userId, carId) => {
    try {
        const user = await model.findOne({ _id: userId});
        const car = user.cars.find(c=>(c._id.toString() === carId));
        const count = car && car.ridescompletedbycar ? car.ridescompletedbycar : 0;

        await model.updateOne(
            { _id: userId, 'cars._id': carId },
            { $set: { "cars.$.ridescompletedbycar": count + 1 } });
    } catch (error) {
        return Promise.reject(error);
    }
}

export const findCar = async (userId, carId) => {
   try {
         const user = await model.findOne({ _id: userId});
         const car = user.cars.find(c=>(c._id.toString() === carId));
        return car;
    } catch (error) {
       return Promise.reject(error);
    }
 }

 export const updateCar = async (body) => {
    try {
        await model.updateOne({ _id: body.user_id, 'cars._id': body.carId },
            {
                $set: {
                    "cars.$.category": body.category, "cars.$.model": body.model,
                     "cars.$.seats": body.seats, "cars.$.carNo": body.carNo , "cars.$.brand":body.Brand
                }
            })
        return;
    } catch (error) {
        return Promise.reject(error);
    }
}