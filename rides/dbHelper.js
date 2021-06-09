import model from './model';
import {getbyId} from '../auth/dbHelper';
import { rideDetails } from './controller';

export const saveRideInDB = async(newRide) => {
    try {
        const obj = await new model(newRide);
        await obj.save();
        return {RideID :obj._id};
    } catch (error) {
        return Promise.reject(err);
    }
}

export const getAllRides = async(user_id) => {
    try {
        const rides = await model.find();
        return rides;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getRideDetails = async(ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        const driverId = ridesDetails.userId;
        const driverDetails = await getbyId(driverId);
        const requestRides = ridesDetails.requestRides;
        var passengers = [];
        
        for(let index = 0 ; index< requestRides.length ; index++){
            const passengerId = requestRides[index].userId;
            const passengerDetails = await getbyId(passengerId);
            console.log(passengerDetails);
            passengers.push({date:requestRides[index].date,time:requestRides[index].time,name:passengerDetails.name,imageUrl:passengerDetails.url})
        }
        return {Name: driverDetails.name, ProfileUrl:driverDetails.url ,Time:ridesDetails.offerRides[0].time, Date:ridesDetails.offerRides[0].date, NoOfSeats:ridesDetails.offerRides[0].noOfSeats,
            NoOfBags:ridesDetails.offerRides[0].bigBagNo,smoking:ridesDetails.offerRides[0].smoking,petAllow:ridesDetails.offerRides[0].petAllow,
            noOfPauses:ridesDetails.offerRides[0].noOfPauses, foodAllow:ridesDetails.offerRides[0].foodAllow, Passengers:passengers
            
        };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const bookRideSaveinDb = async(newRide) => {
    try {
        const ride = await model.findOne({ _id: newRide.id });
        ride.requestRides.push(newRide);
        await ride.save();
    } catch (error) {
        return Promise.reject(error);
    }
}
export const getUserOfferRides = async(userId) => {
    try {
        const Rides = await model.find( { userId: userId } )
        return Rides;
        
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getUserBookRides = async(userId) => {
    try {
        const Rides = await model.find({"requestRides.userId":userId})
        return Rides;
    } catch (error) {
        return Promise.reject(error);
    }
}



export const getBookRideDetails = async(ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        const driverId = ridesDetails.userId;
        const driverDetails = await getbyId(driverId);
        const requestRides = ridesDetails.requestRides;
        var passengers = [];
        
        for(let index = 0 ; index< requestRides.length ; index++){
            const passengerId = requestRides[index].userId;
            const passengerDetails = await getbyId(passengerId);
            passengers.push({userId:requestRides[index].userId, From:requestRides[index].from, To:requestRides[index].to,date:requestRides[index].date,
                            time:requestRides[index].time,Status:requestRides[index].status,
                            name:passengerDetails.name,imageUrl:passengerDetails.url})
        }
        return {Name: driverDetails.name, ProfileUrl:driverDetails.url ,Time:ridesDetails.offerRides[0].time, Date:ridesDetails.offerRides[0].date, NoOfSeats:ridesDetails.offerRides[0].noOfSeats,
            NoOfBags:ridesDetails.offerRides[0].bigBagNo,smoking:ridesDetails.offerRides[0].smoking,petAllow:ridesDetails.offerRides[0].petAllow,
            noOfPauses:ridesDetails.offerRides[0].noOfPauses, foodAllow:ridesDetails.offerRides[0].foodAllow,status:ridesDetails.offerRides[0].status,
             Passengers:passengers
            
        };
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getRideotp = async(ride_id,userId) => {
    try {
        const ridesDetails = await model.findOne({ "_id": ride_id,"requestRides.userId" :userId });
        const requestRides = ridesDetails.requestRides;
        
        for(let index=0; index < requestRides.length ;index++)
        {
            if(userId == requestRides[index].userId)
            {
                var otp = requestRides[index].OTP;
            }
        }
        
        return {OTP : otp};
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changeRideStatus = async(ride_id,userId) => {
    try {
        const update = {status : "Ongoing" };
        const filter = { "_id" : ride_id, "requestRides.userId" : userId };
       
        model.findOneAndUpdate(

            { "_id" : ride_id, "requestRides.userId" : userId },
        
            { 
        
                "$set": {
        
                    "status.$": "Started"
        
                }
        
            },
        
            function(err,doc) {
        
            }
        
        );
        
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}