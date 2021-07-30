import {getAllRides} from '../rides/dbHelper';
import { getUserBookRides } from '../rides/dbHelper';
import { changeRideStatusToCancel } from '../rides/dbHelper';


export const getrequestrides = async(newCar) => {
    try {
        const rides = await getAllRides();
        const created= await rides.filter(r => (r.active));

        const completed = await getUserBookRides();
        const cancelled = await changeRideStatusToCancel();
        return{
             created,
             completed,
             cancelled

        };
   
    } catch (error) {
        return Promise.reject(error);
    }
}
/*
export const getrequestridesdetails = async() => {
    try {
        const rides = await getAllRides.length();
        const completed = await getUserBookRides.length();
        const cancelled = await changeRideStatusToCancel.length();
        return {
               rides,
               completed,
               cancelled
        };
   
    } catch (error) {
        return Promise.reject(error);
    }
}
*/
