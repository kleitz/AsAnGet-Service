import model from './model';

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
        console.log(rides[0].offerRides[0].noOfSeats);
        return rides;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getRideDetails = async(ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        
        return {Time:ridesDetails.offerRides[0].time, Date:ridesDetails.offerRides[0].date, NoOfSeats:ridesDetails.offerRides[0].noOfSeats,
            NoOfBags:ridesDetails.offerRides[0].bigBagNo,smoking:ridesDetails.offerRides[0].smoking,petAllow:ridesDetails.offerRides[0].petAllow,
            noOfPauses:ridesDetails.offerRides[0].noOfPauses, foodAllow:ridesDetails.offerRides[0].foodAllow
            
        };




    } catch (error) {
        return Promise.reject(error);
    }
}
