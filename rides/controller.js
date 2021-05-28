import { saveRideInDB, getRidesFromDb } from './dbHelper';
import axios from 'axios';
import { PolyUtil} from "node-geometry-library";
import { json } from 'body-parser';
import model from './model';


export const createRide = async (req, res, next) => {
    try {
        const {userId, startPoint, endPoint, carType, rideDate, Time, noOfPassenger, costPerSeat,pricePerBag, currency, noOfSeats, noBigBags, noOfPauses,
        smokingAllow, petAllow, foodAllow, recurringRideStartDate,recurringRideEndDate,recurringRideTime  } = req.body;
        let placeUrl = process.env.getPlaceName.replace('replace_lat_lng',startPoint);
        //Api call to get start place from Lat/Log
        const getStartPlace = await axios.get(placeUrl);

        placeUrl = process.env.getPlaceName.replace('replace_lat_lng',endPoint);
        //Api call to get Destination name from Lat/Log
        const getEndPlace = await axios.get(placeUrl);
        
        
        const startPlaceName = getStartPlace.data.results[0].formatted_address;
        const endPlaceName = getEndPlace.data.results[0].formatted_address;
        
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
        console.log(start_locations);
        console.log(end_locations);
        const newRide = new model({
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
            
          });
         await newRide.save();
         return res.status(200).json({RideId:newRide._id});
    }
    catch (error) {
        return res.status(200).send("Unable to create your ride");
        next(error);
        
    }
}

export const findRide = async (req, res, next) => {
    try {
        const {userId, startPoint, endPoint, rideDate, rideTime, noOfPassenger,
             recurringRideStartDate,recurringRideEndDate,recurringRideTime } = req.body;

        console.log(req.body);
        var availabeRides = [];

        var cursor = await model.find();
       
        

        cursor.forEach(()=> {
        const locfound =  PolyUtil.isLocationOnEdge(startPoint, cursor[0].offerRides[0].start_locations,1000);
            if(locfound){
                console.log(locfound);
            
        const rideFound = PolyUtil.isLocationOnEdge(endPoint,  cursor[0].offerRides[0].end_loactions,1000);
                console.log(rideFound);
            if(rideFound){
                
                console.log("ride Matched");
                availabeRides.push(cursor);
            }
            
            else{
                console.log("No Ride Found");
            }
            } 
            else{
                console.log("No Ride Found");
            } 
        
        });
        //console.log(availabeRides);
        
        return res.status(200).send({ availabeRides });
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
        const rides = await model.find({ userId: _id });
        var currentRides = [];
        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (day+"/"+mon+"/"+year);
        console.log(today);
       // console.log(rides);
        rides.forEach( ()=> {
            const rideDate = rides[0].offerRides[0].date;
            console.log(rideDate);
            if(rideDate > today)
            {
                currentRides.push(rides);
            }

        });
        //for each ride check the status of ride and add it to a new array
        
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
        today = (day+"-"+mon+"-"+year);
        console.log(today);
        const allUserRides = await model.find({ userId: _id });
        allUserRides.forEach(myFunction);
        function myFunction(item, index) {
            var rideDate = allUserRides[index].offerRides[0].date;
            console.log(rideDate);
            const date1 = new Date(rideDate);
            const date2 = new Date(today);
            console.log(date1);
            console.log(date2);
            if(date1 > date2)
            {
                completedRides.push(allUserRides);
            }
        }
        return res.status(200).json({completedRides});
    }  catch (error) {
        next(error);
    }
}
