import { Model } from 'mongoose';
import model from './model';
import { userdata } from './userprofile';

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

        console.log(files);
        await model.updateOne({ "_id": body.user_id },
            {
                $set: {
                    "name": body.name, "age": body.age, "phoneNum": body.phoneNum, "email": body.email
                    , "homeaddress": body.homeaddress, "officeaddress": body.officeaddress,
                    "imageUrl": `http://${process.env.serverIPAddress}:${process.env.PORT}/img/${files[0].originalname}`
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

export const deleteCar = async (user_id, car_no) => {
    try {
        await model.updateOne(
            { '_id': user_id }, 
            { $pull: { cars: { carNo: car_no } } }
            
        );
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateCar = async (car_id, user_Id, category, model_no, seat, brand) => {
    try {

        await model.updateOne(
            {
                "_id": user_Id, "cars.carNo": car_id
            },
            {
                $set: { "requestRides.$.category": category,
                        "requestRides.$.model": model_no,
                        "requestRides.$.seat": seat,
                        "requestRides.$.brand": brand,
                        "requestRides.$.carNo": car_id
                        
                }

            })

        return;
    } catch (error) {
        return Promise.reject(error);
    }
}