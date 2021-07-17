import {  getCurrentRideDetails } from './dbHelper';


export const getrides = async (req, res, next) => {
    try {
        console.log("new api");
        const { ride_id } = req.body;
        const rideDetails = await gettodayrides(ride_id);
        return res.status(200).send(rideDetails);
    } catch (error) {
        next(error);
    }
}