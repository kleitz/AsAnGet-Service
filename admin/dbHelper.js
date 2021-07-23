import {getAllRides} from '../rides/dbHelper';


export const getrequestrides = async(newCar) => {
    try {
        const rides = await getAllRides();
        
        return rides.filter(r => (r.active));
   
    } catch (error) {
        return Promise.reject(error);
    }
}