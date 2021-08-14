import { COMPLETED } from './const';
import {
    getUserOfferRides, getUserBookRides, getBookRideDetails,
    getRideotp, changeRideStatus, getRideDateTime, changePassengerRideStatus,
    getCurrentRideDetails, changeRideStatusToCancel, rideStartedByDriver, driverridestatus,
    passengerridestatus, driverCompletedHisRide, updatePassengerStatusByUserId,
    perRidePassengerCost
} from './dbHelper';

import {makeCurrentRideArray} from './helper';


export const currentRide = async (req, res, next) => {
    try {
        console.log('currentride', req.body._id);
        const { _id } = req.body;
        
        const bookRidesForUser = await getUserBookRides(_id);
        const bookedRides = await makeCurrentRideArray(bookRidesForUser,'BookRide');

        const offerRidesForuser = await getUserOfferRides(_id);
        const offeredRides = await makeCurrentRideArray(offerRidesForuser,'OfferRide');
        // console.log('currenrride', JSON.stringify([...bookedRides, ...offeredRides]));
        return res.status(200).json([...bookedRides, ...offeredRides]);
    } catch (error) {
        next(error);
    }
}

export const currentrideDetails = async (req, res, next) => {
    try {
        console.log("new api");
        const { ride_id } = req.body;
        const rideDetails = await getCurrentRideDetails(ride_id);
        return res.status(200).send({ rideDetails, total:0 });
    } catch (error) {
        next(error);
    }
}


export const completedRides = async (req, res, next) => {
    try {

        const { _id } = req.body;
        
        const bookRidesForUser = await getUserBookRides(_id);
        const bookedRides = await makeCurrentRideArray(bookRidesForUser,'BookRide', 'COMPLETED');

        const offerRidesForuser = await getUserOfferRides(_id);
        const offeredRides = await makeCurrentRideArray(offerRidesForuser,'OfferRide', 'COMPLETED');

        // console.log('completedRide', JSON.stringify([...bookedRides, ...offeredRides]));
        return res.status(200).json([...bookedRides, ...offeredRides]);

    } catch (error) {
        next(error);
    }
}

export const historyrideDetails = async (req, res, next) => {
    try {
        const { ride_id } = req.body;
        const rideDetails = await getCurrentRideDetails(ride_id);
        return res.status(200).send(rideDetails);
    } catch (error) {
        next(error);
    }
}

export const getRideOTP = async (req, res, next) => {
    try {

        const { userId, ride_id } = req.body;
        const otp = await getRideotp(ride_id, userId);
        return res.status(200).send(otp);
    } catch (error) {
        next(error);
    }
}

export const verifyRideOTP = async (req, res, next) => {
    try {

        const { userId, ride_id, otp } = req.body;


        const rideotp = await getRideotp(ride_id, userId);
        console.log(rideotp);
        if (rideotp.OTP == otp) {
            const rideStatus = await changeRideStatus(ride_id, userId);

        }
        else {
            return res.status(200).send({ "Failed": "Otp not correct" });
        }

        return res.status(200).send({ "Success": "Ride Started" });


    } catch (error) {
        next(error);
    }
}

export const passengerRideCompleted = async (req, res, next) => {
    try {
        console.log("new api");
        const { ride_id, userId } = req.body;
        await updatePassengerStatusByUserId(ride_id, userId, COMPLETED);
        const amount = await perRidePassengerCost(ride_id, userId);
        console.log(amount);
        return res.status(200).send({ "Ride": "Completed", "Amount": amount });
    } catch (error) {
        next(error);
    }
}

export const driverstartride = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        await rideStartedByDriver(ride_id);

        return res.status(200).send({ "Ride": "Started" });
    } catch (error) {
        next(error);
    }
}
export const driverstatusCompleted = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        const total = await driverCompletedHisRide(ride_id);

        return res.status(200).send({ "Ride": "Completed", total });
    } catch (error) {
        next(error);
    }
}

export const cancelRide = async (req, res, next) => {
    try {
        const { userId, ride_id } = req.body;
        const datetime = await getRideDateTime(ride_id, userId);

        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth() + 1;
        var year = today.getFullYear();
        today = (mon + " " + day + "," + year);
        console.log(today);
        //var todayDate = new Date(today)
        var time = new Date();
        var currentTime = time.getHours() + ":" + time.getMinutes();
        console.log(currentTime);
        const date = datetime.Date;
        const [rday, rmonth, ryear] = date.split('-');
        const dateObj = { rmonth, rday, ryear };
        const rideDate = dateObj.rmonth + ' ' + dateObj.rday + ',' + dateObj.ryear;
        const str = datetime.Time;
        const rtime = str.substring(0, str.length - 2)
        console.log(rtime);


        var dt1 = new Date(today + " " + currentTime);
        var dt2 = new Date(rideDate + " " + "4:00");


        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        const hrDiff = Math.abs(Math.round(diff));
        console.log(hrDiff);
        if (hrDiff > 1) {
            await changeRideStatusToCancel(ride_id, userId);
        }
        console.log(Math.abs(Math.round(diff)));

        return res.status(200).send({ datetime });


    } catch (error) {
        next(error);
    }
}

export const drivercancelRide = async (req, res, next) => {
    try {
        const { userId, ride_id } = req.body;
        const datetime = await getRideDateTime(ride_id, userId);

        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth() + 1;
        var year = today.getFullYear();
        today = (mon + " " + day + "," + year);
        console.log(today);
        //var todayDate = new Date(today)
        var time = new Date();
        var currentTime = time.getHours() + ":" + time.getMinutes();
        console.log(currentTime);
        const date = datetime.Date;
        const [rday, rmonth, ryear] = date.split('-');
        const dateObj = { rmonth, rday, ryear };
        const rideDate = dateObj.rmonth + ' ' + dateObj.rday + ',' + dateObj.ryear;
        const str = datetime.Time;
        const rtime = str.substring(0, str.length - 2)
        console.log(rtime);


        var dt1 = new Date(today + " " + currentTime);
        var dt2 = new Date(rideDate + " " + "4:00");


        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        const hrDiff = Math.abs(Math.round(diff));
        console.log(hrDiff);
        if (hrDiff > 1) {
            await changeRideStatusToCancel(ride_id, userId);
        }
        console.log(Math.abs(Math.round(diff)));

        return res.status(200).send({ datetime });


    } catch (error) {
        next(error);
    }
}

export const getdriverridestatus = async (req, res, next) => {

    try {
        const { ride_id } = req.body;
        const status = await driverridestatus(ride_id);
        return res.status(200).send({ status });
    }
    catch (error) {
        next(error);
    }

}

export const getpassengerridestatus = async (req, res, next) => {

    try {
        const { user_id, ride_id } = req.body;
        const status = await passengerridestatus(ride_id, user_id);
        return res.status(200).send({ status });
    }
    catch (error) {
        next(error);
    }

}

