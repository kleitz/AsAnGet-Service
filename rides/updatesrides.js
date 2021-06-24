import { getUserOfferRides, getUserBookRides, getRideDetails, getBookRideDetails,
         getRideotp, changeRideStatus, getRideDateTime, changeRideStatusToCompleted,
        getCurrentRideDetails, changeRideStatusToCancel, driverstarthisride } from './dbHelper';

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
            
            
            for(let index = 0; index < passanger.length; index++)
            {
                
                if(passanger[index].userId == _id){
                    const Status = passanger[index].Status;
                }
               
            }
           
            if((todayDate < RideDate) || ((todayDate == RideDate)&& (Status == "Cancelled")) 
            || ((todayDate == RideDate)&& (Status == "Upcoming")) || ((todayDate == RideDate)&& (Status == "Ongoing"))){  
                var myJson = { "Type":"BookRide" , Details }
                Bookrides.push(myJson);
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
                console.log(Details);
                var myJson = { "Type":"OfferRide" , Details }
                Offeredrides.push(myJson);
            }

        }
        return res.status(200).json([...Bookrides,...Offeredrides]);
    } catch (error) {
        next(error);
    }
}

export const currentrideDetails = async (req, res, next) => {
    try {
        console.log("new api");
        const { ride_id } = req.body;
        const rideDetails = await getCurrentRideDetails(ride_id);
        return res.status(200).send(rideDetails);
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
        if(rideotp.OTP == otp)
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

export const statusCompleted = async (req, res, next) => {
    try {
        console.log("new api");
        const { userId, ride_id} = req.body;
        const amount = await changeRideStatusToCompleted(ride_id, userId); 
        console.log(amount);
        return res.status(200).send({"Ride":"Completed", "Amount":amount}); 
    } catch (error) {
        next(error);
    }
}

export const driverstartride = async (req, res, next) => {
    try {
        
        const {ride_id} = req.body;
        await driverstarthisride(ride_id); 
        
        return res.status(200).send({"Ride":"Started"}); 
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
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (mon +" "+day+","+year);
        console.log(today);
        //var todayDate = new Date(today)
        var time = new Date();
        var currentTime = time.getHours() + ":" + time.getMinutes();
        console.log(currentTime);
        const date = datetime.Date;
        const [rday, rmonth, ryear] = date.split('-');
            const dateObj = {rmonth, rday, ryear};
            const rideDate = dateObj.rmonth + ' ' + dateObj.rday + ',' + dateObj.ryear;
            const str = datetime.Time; 
            const rtime =  str.substring(0,str.length-2)
        console.log(rtime);
        
           
         var dt1 = new Date(today + " " + currentTime);
         var dt2 = new Date(rideDate + " " + "4:00");
         

         var diff =(dt2.getTime() - dt1.getTime()) / 1000;
         diff /= (60 * 60);
         const hrDiff = Math.abs(Math.round(diff));
         console.log(hrDiff);
         if(hrDiff > 1){
            await changeRideStatusToCancel(ride_id, userId); 
         }
         console.log(Math.abs(Math.round(diff)));
        
       return res.status(200).send({datetime});


    } catch (error) {
        next(error);
    }
}



