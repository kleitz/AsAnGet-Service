import { getAllRides } from './dbHelper';
import axios from 'axios';
import { json } from 'body-parser';
import model from './model';

export const currentRide = async (req, res, next) => {
    try {
        const { _id} = req.body;
        const rides = await getAllRides();
        
 

        var currentRides = [];
        var today = new Date();
        var day = today.getDate();
        var mon = today.getMonth()+1;
        var year = today.getFullYear();
        today = (mon+"-"+day+"-"+year);
        console.log(today);
        
        // allUserRides.forEach(myFunction);
        // function myFunction(item, index) {
        //     var rideDate = allUserRides[index].offerRides[0].date;
        //     console.log(rideDate);
        //     var date1 = new Date(rideDate);
        //     var date2 = new Date(today);
        //     console.log(date1);
        //     console.log(date2);
        //     if(date1 > date2)
        //     {
        //         currentRides.push(allUserRides[index]);
        //     }

        // }
        
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