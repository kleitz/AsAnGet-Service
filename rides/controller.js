import {
    saveRideInDB,
    getRidesFromDb,
    getAllRides,
    getRideDetails,
    bookRideSaveinDb,
    getBookRideDetails,
    updateBigBag
} from './dbHelper';
import { getbyId } from '../auth/dbHelper';
import { getuserratingOutOf5 } from '../ratings/dbHelper';
import {getRideWithDriverDetailsById} from '../rides/dbHelper';
import axios from 'axios';
import { PolyUtil,SphericalUtil } from "node-geometry-library";
import { getDriverDetail } from './helper';

import { sendFireBaseMessage, sendPushNotification } from '../firebase/firebase';


// sendPushNotification();
// sendFireBaseMessage({ text: 'Find ride Test' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');

export const checkfirebase = async(req, res, next)=>{
    try {
        const {passengers, driverDetails} = await getRideWithDriverDetailsById(req.body.rideId);
        const allPassengerHasTopic = passengers.filter(p=>(p.firebaseTopic !== ''));
        const allTopics = allPassengerHasTopic.map(pass=>(pass.firebaseTopic));

        for (let index = 0; index < allTopics.length; index++) {
            const element = allTopics[index];
            console.log('topic passenger',element);
            sendFireBaseMessage({ text: 'Ride Started' }, element, 'Ride');  
        }
        console.log('topic driver',driverDetails.existUser.firebaseTopic);
        sendFireBaseMessage({ text: 'Find ride Test' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');
        return res.status(200).json("sent message");
    }
    catch (error) {
        next(error);
        return res.status(200).send("Unable to create your ride");


    }

}
export const createRide = async (req, res, next) => {
    try {
        const { userId, startPoint, endPoint, carId, rideDate, Time, noOfPassenger, costPerSeat, pricePerBag, currency, noOfSeats, noBigBags,
            noOfPauses, smokingAllow, petAllow, foodAllow, recurringRideStartDate, recurringRideEndDate, recurringRideTime } = req.body;
        let placeUrl = process.env.getPlaceName.replace('replace_lat_lng', startPoint);
        //Api call to get start place from Lat/Log
        const getStartPlace = await axios.get(placeUrl);
        placeUrl = process.env.getPlaceName.replace('replace_lat_lng', endPoint);
        //Api call to get Destination name from Lat/Log
        const getEndPlace = await axios.get(placeUrl);
        const startPlaceName = getStartPlace.data.results[0].formatted_address;
        const endPlaceName = getEndPlace.data.results[0].formatted_address;

        console.log(startPlaceName);
        console.log(endPlaceName);
        let getPolyline = process.env.googleDirectionApi.replace('replace_start_place', startPlaceName);
        getPolyline = getPolyline.replace('replace_end_place', endPlaceName);
        console.log(getPolyline);
        //Api call to get Distance directions and all the polyline points
        const response = await axios.get(getPolyline);

        const routeArr = response.data.routes[0].legs[0].steps;

        const start_locations = routeArr.map((task) => {
            return task.start_location;
        });
        const end_locations = routeArr.map((task) => {
            return task.end_location;
        });

        const viewModel = {
            userId: userId,
            carId: carId,
            offerRides: [{

                from: startPlaceName,
                to: endPlaceName,
                time: Time,
                date: rideDate,
                passengers: noOfPassenger,
                noOfSeats: noOfSeats,
                currency: currency,
                pricePerSeat: costPerSeat,
                pricePerBag: pricePerBag,
                recurringRideStartDate: recurringRideStartDate,
                recurringRideEndDate: recurringRideEndDate,
                recurringRideTime: recurringRideTime,
                start_locations: start_locations,
                end_loactions: end_locations,
                bigBagNo: noBigBags,
                noOfPauses: noOfPauses,
                smoking: smokingAllow,
                petAllow: petAllow,
                foodAllow: foodAllow,
                firebaseTopic: `${userId}${Date.now()}`

            }],
        }
        const RideId = await saveRideInDB(viewModel);
        return res.status(200).json(RideId);
    }
    catch (error) {
        next(error);
        return res.status(200).send("Unable to create your ride");


    }
}

export const findRide = async (req, res, next) => {
    try {
        const { userId, startPoint, endPoint, rideDate, rideTime, noOfPassenger,
            recurringRideStartDate, recurringRideEndDate, recurringRideTime, fcmToken } = req.body;

        console.log('fcmToken', fcmToken.toString());
        
        var availabeRides = [];

        const cursor = await getAllRides();
        console.log(cursor);
        for (let index = 0; index < cursor.length; index++) {
            const element = cursor[index].offerRides[0];
            const {startLatLong,endLatLong} = element;
            const distance = SphericalUtil.computeDistanceBetween(startLatLong,endPoint);
            
            if (noOfPassenger <= cursor[index].offerRides[0].noOfSeats && 
                userId != cursor[index].userId && 
                distance!==0) {

                const locfound = PolyUtil.isLocationOnEdge(startPoint, cursor[index].offerRides[0].start_locations, 1000);
                if (locfound) {
                    console.log(locfound);

                    const rideFound = PolyUtil.isLocationOnEdge(endPoint, cursor[index].offerRides[0].end_loactions, 1000);
                    console.log(rideFound);
                    if (rideFound) {

                        const driverId = cursor[index].userId;
                        const carId = cursor[index].carId;
                        const driverDetails = await getDriverDetail(driverId);
                        let carDetail = driverDetails.existUser.cars.find(car=>(car._id.toString() === carId));
                        carDetail = carDetail ?? {};
                        
                        availabeRides.push({
                            id: cursor[index]._id, 
                            from: cursor[index].offerRides[0].from, 
                            to: cursor[index].offerRides[0].to,
                            time: cursor[index].offerRides[0].time, 
                            Date: cursor[index].offerRides[0].date,
                            carDetail,
                            noOfSeats: cursor[index].offerRides[0].noOfSeats, 
                            currency: cursor[index].offerRides[0].currency,
                            pricePerSeat: cursor[index].offerRides[0].pricePerSeat, 
                            pricePerBag: cursor[index].offerRides[0].pricePerBag,
                            noBigBags : cursor[index].offerRides[0].bigBagNo,
                            recurringRideStartDate: cursor[index].offerRides[0].recurringRideStartDate,
                            recurringRideEndDate: cursor[index].offerRides[0].recurringRideEndDate,
                            recurringRideTime: cursor[index].offerRides[0].recurringRideTime,
                            noOfPauses: cursor[index].offerRides[0].noOfPauses, 
                            smoking: cursor[index].offerRides[0].smoking, 
                            petAllow: cursor[index].offerRides[0].petAllow,
                            foodAllow: cursor[index].offerRides[0].foodAllow, 
                            driverDetails
                        });

                    }

                    else {
                        console.log("No Ride Found");
                    }
                }
                else {
                    console.log("No Ride Found");
                }

            }
        }
        return res.status(200).send({ availabeRides });
    }




    catch (error) {
        next(error);
    }
}

export const rideDetails = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        const rideDetail = await getBookRideDetails(ride_id);
        return res.status(200).send(rideDetail);
    } catch (error) {
        next(error);
    }
}


export const bookRide = async (req, res, next) => {
    try {
        const { _id, userId, from, to, Time, rideDate, noOfPassenger, noOfSeats, noBigBags,
            recurringRideStartDate, recurringRideEndDate, recurringRideTime } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000);

        const modelView = {
            id: _id,
            userId: userId,
            from: from,
            to: to,
            time: Time,
            date: rideDate,
            passengers: noOfPassenger,
            noOfSeats: noOfSeats,
            bigBagNo: noBigBags,
            recurringRideStartDate: recurringRideStartDate,
            recurringRideEndDate: recurringRideEndDate,
            recurringRideTime: recurringRideTime,
            OTP: otp,
        };

        const saved = await bookRideSaveinDb(modelView);

        const rideInfo = await getBookRideDetails(_id);
        const NoOfSeats = rideInfo.noOfSeats;
        const TotalBigBag = rideInfo.noBigBags;
        const currentNoOfBags = TotalBigBag - noBigBags;
        const currentNoOfSeats = NoOfSeats - noOfSeats;

        if(saved == false){
            await updateBigBag(_id,currentNoOfBags,currentNoOfSeats);
        }
        
        return saved ? res.status(200).send({ "Status": "Already booked this ride" }) :
            res.status(200).send({ "Success": "Saved" });

    } catch (error) {
        next(error);
    }
}

export const rideDistance = async (req, res, next) => {
    try {
        const { pickupText, destText, startPoint, endPoint } = req.body;

        if ((startPoint == "" && endPoint == "") || (startPoint == "" || endPoint == "")) {
            return res.status(200).json("RideId: 0KM");

        }
        else {
            let placeUrl = process.env.getPlaceName.replace('replace_lat_lng', startPoint);

            //Api call to get start place from Lat/Log
            const getStartPlace = await axios.get(placeUrl);
            placeUrl = process.env.getPlaceName.replace('replace_lat_lng', endPoint);
            //Api call to get Destination name from Lat/Log
            const getEndPlace = await axios.get(placeUrl);
            const startPlaceName = getStartPlace.data.results[0].formatted_address;

            const endPlaceName = getEndPlace.data.results[0].formatted_address;


            let getPolyline = process.env.googleDirectionApi.replace('replace_start_place', startPlaceName);
            getPolyline = getPolyline.replace('replace_end_place', endPlaceName);

            const URI = getPolyline;
            const encodedURI = encodeURI(URI);
            //Api call to get Distance directions and all the polyline points
            const response = await axios.get(encodedURI);

            const distance = response.data.routes[0] ?
                response.data.routes[0].legs[0].distance.text : 'To Far';
            return res.status(200).send({ "Distance": distance });


        }

    }
    catch (error) {
        next(error);
        return res.status(200).send("Unable to calculatedistance");
    }
}

