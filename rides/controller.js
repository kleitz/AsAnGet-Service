import { saveRideInDB, getRidesFromDb,getAllRides,getRideDetails } from './dbHelper';
import {getbyId} from '../auth/dbHelper';
import axios from 'axios';
import { PolyUtil} from "node-geometry-library";
import { json } from 'body-parser';
import model from './model';



export const createRide = async (req, res, next) => {
    try {
        const {userId, startPoint, endPoint, carType, rideDate, Time, noOfPassenger, costPerSeat,pricePerBag, currency, noOfSeats, noBigBags,
        noOfPauses, smokingAllow, petAllow, foodAllow, recurringRideStartDate,recurringRideEndDate,recurringRideTime  } = req.body;
        let placeUrl = process.env.getPlaceName.replace('replace_lat_lng',startPoint);
        //Api call to get start place from Lat/Log
        const getStartPlace = await axios.get(placeUrl);
        placeUrl = process.env.getPlaceName.replace('replace_lat_lng',endPoint);
        //Api call to get Destination name from Lat/Log
        const getEndPlace = await axios.get(placeUrl);
        const startPlaceName = getStartPlace.data.results[0].formatted_address;
        const endPlaceName = getEndPlace.data.results[0].formatted_address;
        
        console.log(startPlaceName);
        console.log(endPlaceName);
        let getPolyline = process.env.googleDirectionApi.replace('replace_start_place',startPlaceName);
        getPolyline = getPolyline.replace('replace_end_place',endPlaceName);
        console.log(getPolyline);
        //Api call to get Distance directions and all the polyline points
        const response = await axios.get(getPolyline);
       
        const routeArr = response.data.routes[0].legs[0].steps;
       
        const start_locations = routeArr.map( (task)=> {
            return task.start_location; 
        });
        const end_locations = routeArr.map( (task)=> {
            return task.end_location; 
        });
        
        const viewModel = {
            userId:userId,
            offerRides: [{
                
                from:startPlaceName ,
                to:endPlaceName ,
                time:Time,
                date:rideDate ,
                carType: carType,
                passengers: noOfPassenger,
                noOfSeats: noOfSeats,
                currency: currency,
                pricePerSeat: costPerSeat,
                pricePerBag:pricePerBag,
                recurringRideStartDate: recurringRideStartDate,
                recurringRideEndDate: recurringRideEndDate,
                recurringRideTime: recurringRideTime,
                start_locations:start_locations,
                end_loactions:end_locations,
                bigBagNo:noBigBags,
                noOfPauses: noOfPauses,
                smoking: smokingAllow,
                petAllow: petAllow,
                foodAllow: foodAllow,
              
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
        const {userId, startPoint, endPoint, rideDate, rideTime, noOfPassenger,
             recurringRideStartDate,recurringRideEndDate,recurringRideTime } = req.body;

        
        var availabeRides = [];

        const cursor = await getAllRides();
        console.log(cursor);
        cursor.forEach(myFunction);
        
        function myFunction(item, index){     
        console.log(cursor[0].offerRides[0].noOfSeats)

        if(noOfPassenger <= cursor[index].offerRides[0].noOfSeats)
        {

            const locfound =  PolyUtil.isLocationOnEdge(startPoint, cursor[index].offerRides[0].start_locations,1000);
            if(locfound){
                console.log(locfound);
            
            const rideFound = PolyUtil.isLocationOnEdge(endPoint,  cursor[index].offerRides[0].end_loactions,1000);
                console.log(rideFound);
            if(rideFound){
                const userId = cursor[index].userId;
               // const userData = await getbyId(userId);
                console.log(userData);
                console.log(userId);
                availabeRides.push(cursor[index]);
            }
            
            else{
                console.log("No Ride Found");
            }
            } 
            else{
                console.log("No Ride Found");
            } 
        
        }
    }
        //console.log(availabeRides);
        
        return res.status(200).send({ availabeRides });
    } catch (error) {
        next(error);
    }
}

export const rideDetails = async (req, res, next) => {
    try {
        console.log("new api");
        const { ride_id } = req.body;
        const rideDetails = await getRideDetails(ride_id);
        console.log(rideDetails);
        
        
        return res.status(200).send(rideDetails);
    } catch (error) {
        next(error);
    }
}


export const bookRide = async (req, res, next) => {
        try {
            const { _id,from, to, Time, rideDate, noOfPassenger, noOfSeats, noBigBags,
                 recurringRideStartDate,recurringRideEndDate,recurringRideTime } = req.body;
            const ride = await model.findOne({ _id: _id });
            ride.requestRides.push({
                from:from ,
                to:to ,
                time:Time ,
                date:rideDate ,
                passengers: noOfPassenger,
                noOfSeats: noOfSeats,
                bigBagNo:noBigBags,
                recurringRideStartDate: recurringRideStartDate,
                recurringRideEndDate: recurringRideEndDate,
                recurringRideTime: recurringRideTime,
            });
            
            const updated = await ride.save()
            return res.status(200).send(updated);
        } catch (error) {
            next(error);
        }
}

export const currentRide = async (req, res, next) => {
    try {
        const { _id} = req.body;
        var currentRides = [];
        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (mon+"-"+day+"-"+year);
        console.log(today);
        const allUserRides = await model.find({ userId: _id });
        allUserRides.forEach(myFunction);
        function myFunction(item, index) {
            var rideDate = allUserRides[index].offerRides[0].date;
            console.log(rideDate);
            var date1 = new Date(rideDate);
            var date2 = new Date(today);
            console.log(date1);
            console.log(date2);
            if(date1 > date2)
            {
                currentRides.push(allUserRides[index]);
            }

        }
        
        return res.status(200).json({currentRides});
    } catch (error) {
        next(error);
    }
}

export const completedRide = async (req, res, next) => {
    try {
        const { _id} = req.body;
        
        var completedRides = [];
        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (mon+"-"+day+"-"+year);
        console.log(today);
        const allUserRides = await model.find({ userId: _id });
        allUserRides.forEach(myFunction);
        function myFunction(item, index) {
            var rideDate = allUserRides[index].offerRides[0].date;
            console.log(rideDate);
            var date1 = new Date(rideDate);
            var date2 = new Date(today);
            console.log(date1);
            console.log(date2);
            if(date1 < date2)
            {
                completedRides.push(allUserRides[index]);
            }
        }
        return res.status(200).json({completedRides});
    }  catch (error) {
        next(error);
    }
}
