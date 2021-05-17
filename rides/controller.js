import { saveRideInDB, getRidesFromDb } from './dbHelper';
import axios from 'axios';
import { PolyUtil} from "node-geometry-library";
import { json } from 'body-parser';
import model from './model';


export const createRide = async (req, res, next) => {
    try {
        const { startPoint, endPoint, rideDate, Time, noOfPassenger, costPerSeat, noOfSeats, noBigBags, noOfPauses,
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
        getPolyline = process.env.googleDirectionApi.replace('replace_end_place',endPlaceName);

        //Api call to get Distance directions and all the polyline points
        const response = await axios.get(getPolyline);
        const routeArr = response.data.routes[0].legs[0].steps;
        const start_locations = routeArr.map( (task)=> {
            return task.start_location; 
        });
        const end_locations = routeArr.map( (task)=> {
            return task.end_location; 
        });
        
        const newRide = new model({
            offerRides: [{
                from:startPlaceName ,
                to:endPlaceName ,
                time:Time ,
                date:rideDate ,
                passengers: noOfPassenger,
                noOfSeats: noOfSeats,
                pricePerSeat: costPerSeat,
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
         return res.status(200).send("ride save");
    }
    catch (error) {
        next(error);
    }
}

export const findRide = async (req, res, next) => {
    try {
        const { startPoint, endPoint, rideDateTime, noOfPassenger } = req.body;
        //const response = await axios.get(`${process.env.googleDirectionApi}`);
            const startLoc = {'lat': 36.083595, 'lng': -95.85105039999999};
            const endLoc = {'lat': 36.0899493, 'lng': -95.8510744};
        // const startLoc = startPoint;
        // const endLoc = endPoint;
        // console.log(startPoint);
        // console.log(endPoint);
        // const startLoc = {startPoint};
        // const endLoc = {endPoint};
        var availabeRides = [];

        var cursor = await model.find();
        
        cursor.forEach( ()=> {
        
        const locfound =  PolyUtil.isLocationOnEdge(startPoint, cursor[0].offerRides[0].start_locations,0);
            if(locfound){
                console.log(locfound);
            
        const rideFound = PolyUtil.isLocationOnEdge(endLoc,  cursor[0].offerRides[0].end_loactions,0);
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
        const foundRides = [
            {
                profilePhotoUrl: `${process.env.serverPath}/img/Cristinia_josef.png`,
                name: "Cristinia josef",
                carName: "Hatchback Tata Altroz",
                rating: 4,
                from: "street 14 ny city",
                to: "street 18 los angel",
                time: "4.20 pm",
                seats: 2,
                price: "100 $"
            },
            {
                profilePhotoUrl: `${process.env.serverPath}/img/robert.png`,
                name: "Robert",
                carName: "Ford",
                rating: 4.5,
                from: "Springer nature street 9 landon Uk",
                to: "wolter landon Uk",
                time: "1.00 pm",
                seats: 3,
                price: "200 $"
            }
        ]
        return res.status(200).send({ availabeRides });
    } catch (error) {
        next(error);
    }
}