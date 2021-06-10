import { getUserOfferRides, getUserBookRides, getRideDetails, getBookRideDetails,
         getRideotp, changeRideStatus } from './dbHelper';
import axios from 'axios';
import { json } from 'body-parser';


export const currentRide = async (req, res, next) => {
    try {
        const { _id} = req.body;
        var Bookrides = [];
        var Offeredrides = [];
        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (mon+"-"+day+"-"+year);
        var todayDate = new Date(today);
        const bookrides = await getUserBookRides(_id);
        
        for(let index = 0 ; index< bookrides.length ; index++)
        {

            const date = bookrides[index].offerRides[0].date;
            const [day, month, year] = date.split('-');
            const dateObj = {month, day, year};
            const rideDate = dateObj.month + '-' + dateObj.day + '-' + dateObj.year;
            const RideDate = new Date(rideDate);
            const rideId = bookrides[index]._id;
            const Details = await getBookRideDetails(rideId);
            const passanger = [Details.Passengers[0]];
            
            
            console.log(passanger);
            for(let index = 0; index < passanger.length; index++)
            {
                
                if(passanger[index].userId == _id){
                    const Status = passanger[index].Status;
                }
               
            }
           
            if((todayDate < RideDate) || ((todayDate == RideDate)&& (Status == "Cancelled")) 
            || ((todayDate == RideDate)&& (Status == "Upcoming")) || ((todayDate == RideDate)&& (Status == "Ongoing"))){  
                Bookrides.push(Details);
            }

        }
        const getOfferRides = await getUserOfferRides(_id);
        
        for(let index = 0 ; index< getOfferRides.length ; index++)
        {
            const date = getOfferRides[index].offerRides[0].date;
            const status = getOfferRides[index].offerRides[0].Status;
            const [day, month, year] = date.split('-');
            const dateObj = {month, day, year};
            
            const rideDate = dateObj.month + '-' + dateObj.day + '-' + dateObj.year;
            const RideDate = new Date(rideDate);
            if((todayDate < RideDate) || ((todayDate == RideDate)&& (Status == "Cancelled")) 
            || ((todayDate == RideDate)&& (Status == "Upcoming")) || ((todayDate == RideDate)&& (Status == "Ongoing"))){
                const rideId = getOfferRides[index]._id;
                const Details = await getBookRideDetails(rideId);
                Offeredrides.push(Details);
            }

        }
        return res.status(200).json({Bookrides,Offeredrides});
    } catch (error) {
        next(error);
    }
}

export const completedRides = async (req, res, next) => {
    try {
        const { _id} = req.body;
        var Bookrides = [];
        var Offeredrides = [];
        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (mon+"-"+day+"-"+year);
        var todayDate = new Date(today);
        const bookrides = await getUserBookRides(_id);
        
        for(let index = 0 ; index< bookrides.length ; index++)
        {

            const date = bookrides[index].offerRides[0].date;
            const [day, month, year] = date.split('-');
            const dateObj = {month, day, year};
            const rideDate = dateObj.month + '-' + dateObj.day + '-' + dateObj.year;
            const RideDate = new Date(rideDate);
            const rideId = bookrides[index]._id;
            const Details = await getBookRideDetails(rideId);
            const passanger = [Details.Passengers[0]];
            
            
            console.log(passanger);
            for(let index = 0; index < passanger.length; index++)
            {
                
                if(passanger[index].userId == _id){
                    const Status = passanger[index].Status;
                }
               
            }
           
            if((todayDate < RideDate) || ((todayDate == RideDate)&& (Status == "Cancelled")) 
            || ((todayDate == RideDate)&& (Status == "Upcoming")) || ((todayDate == RideDate)&& (Status == "Ongoing"))){  
                Bookrides.push(Details);
            }

        }
        const getOfferRides = await getUserOfferRides(_id);
        
        for(let index = 0 ; index< getOfferRides.length ; index++)
        {
            const date = getOfferRides[index].offerRides[0].date;
            const status = getOfferRides[index].offerRides[0].Status;
            const [day, month, year] = date.split('-');
            const dateObj = {month, day, year};
            
            const rideDate = dateObj.month + '-' + dateObj.day + '-' + dateObj.year;
            const RideDate = new Date(rideDate);
            if((todayDate > RideDate) || ((todayDate == RideDate)&& (Status == "Upcoming")) || ((todayDate == RideDate)&& (Status == "Ongoing"))){
                const rideId = getOfferRides[index]._id;
                const Details = await getBookRideDetails(rideId);
                Offeredrides.push(Details);
            }

        }
        return res.status(200).json({Bookrides,Offeredrides});
    } catch (error) {
        next(error);
    }
}


export const getRideOTP = async (req, res, next) => {
    try {
        console.log("new api");
        const { userId, ride_id } = req.body;
        const otp = await getRideotp(ride_id, userId);
        return res.status(200).send(otp);
    } catch (error) {
        next(error);
    }
}

export const verifyRideOTP = async (req, res, next) => {
    try {
        console.log("new api");
        const { userId, ride_id, otp } = req.body;
        const c = await changeRideStatus(ride_id, userId); 
        console.log(c);
        return res.status(200).send(c);

        const rideotp = await getRideotp(ride_id, userId);
        
        if(rideotp == otp)
        {
            const rideStatus = await changeRideStatus(ride_id, userId); 
            
        }
        else
        {
            return res.status(200).send({"Failed":"Otp not correct"}); 
        }
        
       return res.status(200).send({"Success":"Ride Started"});


    } catch (error) {
        next(error);
    }
}



