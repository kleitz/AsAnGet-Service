import { saveRideInDB } from './dbHelper';
import axios from 'axios';
import { PolyUtil} from "node-geometry-library";


export const createRide = async (req, res, next) => {
    try {
        const response = await axios.get(`${process.env.googleDirectionApi}`);
        const routes = response.map(res,()=>{
            return res.routes;
        })

        const legs = routes.map(route,()=>{
            return route.legs;
        })

        const steps = legs.map(leg,()=>{
            return leg.steps;
        })

        const startLoc = steps.map(step,()=>{
            return step.start_location;
        })

       // const loc = response.map(routes[0].legs[0].steps[0].start_location);
        // console.log(loc);
        await saveRideInDB(req.body);
        return res.status(200).send("ride save");
    }
    catch (error) {
        next(error);
    }
}

export const findRide = async (req, res, next) => {
    try {
        const { startPoint, endPoint, rideDateTime, noOfPassenger } = req.body;
        const response = await axios.get(`${process.env.googleDirectionApi}`);
        //console.log(response.data);
         
        const startLoc = {'lat': 25.7, 'lng': -80.1};
        const endLoc = {'lat': 25.771, 'lng': -80.186};
        const locfound =  PolyUtil.isLocationOnEdge(startLoc, [ {'lat': 25.775, 'lng': -80.190},
                                                                {'lat': 18.466, 'lng': -66.118},
                                                                {'lat': 32.321, 'lng': -64.757}],1000)  ;
        if(locfound){
            const rideFound =  PolyUtil.isLocationOnEdge(endLoc, [ {'lat': 25.771, 'lng': -80.181},
                                                                {'lat': 18.466, 'lng': -66.118},
                                                                {'lat': 32.321, 'lng': -64.757}],1000)  ;
        console.log(rideFound);
        if(rideFound){
            
            console.log("ride Matched");
        }
        
        else{
            console.log("No Ride Found");
        }
        } 
        else{
            console.log("No Ride Found");
        }       
        

        
        
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
        return res.status(200).send({ foundRides });
    } catch (error) {
        next(error);
    }
}