import { ObjectID } from 'mongodb';
import model from './model';
import { getbyId } from '../auth/dbHelper';
import { getuserratingOutOf5 } from '../ratings/dbHelper';
import { sendFireBaseMessage } from '../firebase/firebase';
import { getRideDate, getRideTime, isPassengerAlreadyBookTheRide } from './helper';
import { COMPLETED, ONGOING, UPCOMING } from './const';


const getRideWithDriverDetailsById = async (ride_id) => {
    const ridesDetails = await model.findOne({ _id: ride_id });

    const driverId = ridesDetails.userId;
    const driverDetails = await getbyId(driverId);
    const rating = await getuserratingOutOf5(driverId);
    driverDetails.rating = rating;

    const requestRides = ridesDetails.requestRides;
    var passengers = [];

    for (let index = 0; index < requestRides.length; index++) {
        const passengerId = requestRides[index].userId;
        const passengerDetails = await getbyId(passengerId);

        passengers.push({
            name: passengerDetails.existUser.name ?? '',
            imageUrl: passengerDetails.existUser.imageUrl ?? '',
            userId: requestRides[index].userId,
            status: requestRides[index].status,
            phoneNum: requestRides[index].phoneNum ?? '',
            from: requestRides[index].from,
            to: requestRides[index].to,
            date: requestRides[index].date,
            time: requestRides[index].time,
        })

    }

    return { ridesDetails, driverDetails, passengers };
}

const updateAllRequestedStatus = async (ride_id, status) => {
    try {
        const ride = await model.findOne({ _id: new ObjectID(ride_id) });

        //...update driver ride status
        await model.updateOne(
            { _id: new ObjectID(ride_id), 'offerRides._id': new ObjectID(ride.offerRides[0]._id) },
            { $set: { "offerRides.$.status": status } });

        //...update all passenger ride status  
        if (ride.requestRides && ride.requestRides.length > 0) {
            const requestRides = ride.requestRides;
            for (let index = 0; index < requestRides.length; index++) {
                const element = requestRides[index];
                await model.updateOne(
                    { _id: new ObjectID(ride_id), 'requestRides._id': new ObjectID(element._id) },
                    { $set: { "requestRides.$.status": status } }
                );
            }
        }
    } catch (error) {
        throw new Error(error);
    }

}

export const perRidePassengerCost = async (ride_id, userId) => {
    const ride = await model.findOne({ "_id": new ObjectID(ride_id) });
    const passenger = ride.requestRides.find(reqRide=>(reqRide.userId === userId));

    const perseatcost = ride.offerRides[0].pricePerSeat;
    const perbagcost = ride.offerRides[0].pricePerBag;

    const passangerseats = passenger.noOfSeats;
    const passangerbags = passenger.bigBagNo;
    return ((perseatcost * passangerseats) + (perbagcost * passangerbags));
}

export const updatePassengerStatusByUserId = async(ride_id, userId, status) => {
    await model.updateOne(
        { _id: new ObjectID(ride_id), 'requestRides.userId': userId },
        { $set: { "requestRides.$.status": status } }
    );
}


export const saveRideInDB = async (newRide) => {
    try {
        const obj = await new model(newRide);
        await obj.save();
        return { RideID: obj._id };
    } catch (error) {
        return Promise.reject(err);
    }
}

export const getAllRides = async (user_id) => {
    try {
        const rides = await model.find();
        return rides;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getRideDetails = async (ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        const driverId = ridesDetails.userId;
        const driverDetails = await getbyId(driverId);
        const requestRides = ridesDetails.requestRides;
        var passengers = [];
        console.log(driverDetails);
        for (let index = 0; index < requestRides.length; index++) {
            const passengerId = requestRides[index].userId;
            const passengerDetails = await getbyId(passengerId);
            console.log(passengerDetails);
            passengers.push({
                user_id: requestRides[index].userId,
                date: requestRides[index].date,
                time: requestRides[index].time,
                name: passengerDetails.existUser.name,
                imageUrl: passengerDetails.existUser.imageUrl
            })
        }
        return {
            Name: driverDetails.existUser.name, ProfileUrl: driverDetails.existUser.imageUrl, carType: ridesDetails.offerRides[0].carType,
            from: ridesDetails.offerRides[0].from, to: ridesDetails.offerRides[0].to, Time: ridesDetails.offerRides[0].time, Date: ridesDetails.offerRides[0].date, NoOfSeats: ridesDetails.offerRides[0].noOfSeats,
            NoOfBags: ridesDetails.offerRides[0].bigBagNo, smoking: ridesDetails.offerRides[0].smoking, petAllow: ridesDetails.offerRides[0].petAllow,
            noOfPauses: ridesDetails.offerRides[0].noOfPauses, foodAllow: ridesDetails.offerRides[0].foodAllow, recurringRideStartDate: ridesDetails.offerRides[0].recurringRideStartDate,
            recurringRideEndDate: ridesDetails.offerRides[0].recurringRideEndDate, recurringRideTime: ridesDetails.offerRides[0].recurringRideTime,
            user_id: ridesDetails.userId, Ride_id: ridesDetails._id, Currency: ridesDetails.offerRides[0].currency,
            pricePerSeat: ridesDetails.offerRides[0].pricePerSeat, priceperBag: ridesDetails.offerRides[0].pricePerBag, Passengers: passengers

        };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const bookRideSaveinDb = async (newRide) => {
    try {
        const ride = await model.findOne({ _id: newRide.id });
        if (isPassengerAlreadyBookTheRide(ride.requestRides, newRide.userId)) return true;

        let updatedNewRide = newRide;
        updatedNewRide.firebaseTopic = ride.firebaseTopic;

        ride.requestRides.push(updatedNewRide);
        await ride.save();

        //...will refactor once we implemnt firebase
        const offerRide = ride.offerRides[0];
        const text = `${newRide.userName} booked ride from ${offerRide.from} to ${offerRide.to}`;
        const objForDb = { text }
        const topic = ride.userId.toString();
        const title = 'Booked Ride';

        sendFireBaseMessage(objForDb, topic, title);

        return false;

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getUserOfferRides = async (userId) => {
    try {
        const Rides = await model.find({ userId: userId })
        return Rides;

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getUserBookRides = async (userId) => {
    try {
        const Rides = await model.find({ "requestRides.userId": userId })
        return Rides;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getBookRideDetails = async (ride_id) => {
    try {
        const { ridesDetails, driverDetails, passengers } = await getRideWithDriverDetailsById(ride_id);
        return {
            RideId: ridesDetails._id,
            From: ridesDetails.offerRides[0].from,
            To: ridesDetails.offerRides[0].to,
            Time: getRideTime(ridesDetails.offerRides[0]),
            Date: getRideDate(ridesDetails.offerRides[0]),
            carType: ridesDetails.offerRides[0].carType,
            status: ridesDetails.offerRides[0].status,
            Passengers: passengers,
            driverDetails
        };
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getRideotp = async (ride_id, userId) => {
    try {
        const ridesDetails = await model.findOne({ "_id": ride_id, "requestRides.userId": userId });
        const requestRides = ridesDetails.requestRides;

        for (let index = 0; index < requestRides.length; index++) {
            if (userId == requestRides[index].userId) {
                var otp = requestRides[index].OTP;
            }
        }

        return { OTP: otp };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changeRideStatus = async (ride_id, user_Id) => {
    try {

        await model.updateOne(
            {
                "_id": ride_id, "requestRides.userId": user_Id, "requestRides.status": UPCOMING
            },
            {
                $set: { "requestRides.$.status": ONGOING }

            })

        return;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changePassengerRideStatus = async (ride_id, userId, Status) => {
    try {
        await updatePassengerStatusByUserId(ride_id, userId, Status)
        return await perRidePassengerCost(ride_id, userId);

    } catch (error) {
        return Promise.reject(error);
    }
}


export const getRideDateTime = async (ride_id, user_Id) => {
    try {


        const Details = await model.findOne({ "_id": ride_id, "requestRides.userId": user_Id }, { requestRides: 1 });
        const a = Details.requestRides.filter(req => (req.userId === user_Id))
        //console.log(a);
        return { Date: a[0].date, Time: a[0].time };
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getCurrentRideDetails = async (ride_id) => {
    try {
        const { ridesDetails, driverDetails, passengers } = await getRideWithDriverDetailsById(ride_id);

        return {
            Name: driverDetails.existUser.name ?? '',
            ProfileUrl: driverDetails.existUser.imageUrl ?? '',
            phoneNum: driverDetails.existUser.phoneNum ?? '',
            From: ridesDetails.offerRides[0].from,
            To: ridesDetails.offerRides[0].to,
            Time: ridesDetails.offerRides[0].time,
            Date: ridesDetails.offerRides[0].date,
            NoOfSeats: ridesDetails.offerRides[0].noOfSeats,
            pricePerSeat: ridesDetails.offerRides[0].pricePerSeat,
            pricePerBag: ridesDetails.offerRides[0].pricePerBag,
            noOfSeats: ridesDetails.offerRides[0].noOfSeats,
            NoOfBags: ridesDetails.offerRides[0].bigBagNo,
            smoking: ridesDetails.offerRides[0].smoking,
            petAllow: ridesDetails.offerRides[0].petAllow,
            noOfPauses: ridesDetails.offerRides[0].noOfPauses,
            foodAllow: ridesDetails.offerRides[0].foodAllow,
            status: ridesDetails.offerRides[0].status,
            CarType: ridesDetails.offerRides[0].carType,
            recurringRideStartDate: ridesDetails.offerRides[0].recurringRideStartDate,
            recurringRideEndDate: ridesDetails.offerRides[0].recurringRideEndDate,
            recurringRideTime: ridesDetails.offerRides[0].recurringRideTime,
            user_id: ridesDetails.userId, Ride_id: ridesDetails._id,
            Currency: ridesDetails.offerRides[0].currency,
            pricePerSeat: ridesDetails.offerRides[0].pricePerSeat,
            priceperBag: ridesDetails.offerRides[0].pricePerBag,
            Passengers: passengers,
        };
    } catch (error) {
        return Promise.reject(error);
    }
}


export const changeRideStatusToCancel = async (ride_id, user_Id) => {
    try {

        await model.updateOne(
            {
                "_id": ride_id, "requestRides.userId": user_Id, "requestRides.status": UPCOMING
            },
            {
                $set: { "requestRides.$.status": "Cancelled" }

            })

        return;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changecompleteride = async (ride_id, user_Id) => {
    try {

        await model.updateOne(
            {
                "_id": ride_id, "userId": user_Id
            },
            {
                $set: { "requestRides.$.status": "Cancelled" }

            })

        return;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const rideStartedByDriver = async (ride_id) => {
    try {
        await updateAllRequestedStatus(ride_id, ONGOING);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const driverCompletedHisRide = async (ride_id) => {
    try {
        await updateAllRequestedStatus(ride_id, COMPLETED);
        // return await perRideDriverIncome(ride_id);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const driverridestatus = async (ride_id) => {
    try {

        const data = await model.findOne({ _id: ride_id });
        return data.offerRides[0].status;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const passengerridestatus = async (ride_id, user_id) => {
    try {

        const data = await model.findOne({ "_id": ride_id, "requestRides.userId": user_id });
        const requestRides = data.requestRides;
        var newdata = requestRides.filter(task => {
            if (task.userId == user_id) {
                return task.status;
            }
        });

        return newdata[0].status;
    } catch (error) {
        return Promise.reject(error);
    }
}

