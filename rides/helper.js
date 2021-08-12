import {getBookRideDetails} from './dbHelper';

export const getRideTime = (ride) => ((ride.time !== '') ? ride.time : ride.recurringRideTime);

export const getRideDate = (ride) => ((ride.date !== '') ? ride.date : ride.recurringRideEndDate);

export const convertStringToDate = (date) => {
    const [day, month, year] = date.split('-');
    const dateObj = { month, day, year };
    const rideDate = dateObj.month + '-' + dateObj.day + '-' + dateObj.year;
    return new Date(rideDate);
}

export const isCurrentDateGreaterThan = (date2) => {
    const date1 = new Date();
    date1.setHours(0, 0, 0, 0);
    return date1 > date2;
}

export const getCurrentRide = async(bookOfferRide, rideId)=>{
    const date = getRideDate(bookOfferRide);
    const rideDate = convertStringToDate(date);

    if(!isCurrentDateGreaterThan(rideDate)){
        return await getBookRideDetails(rideId);
    }
    return null;

}

export const makeCurrentRideArray = async (rides, rideType) => {
    const currentRideArray = [];
    for (let index = 0; index < rides.length; index++) {
        const offerRide = rides[index].offerRides[0];
        const rideId = rides[index]._id;
        console.log('----',offerRide, rideId);
        const Details = await getCurrentRide(offerRide, rideId);
        if(Details){
            var myJson = { "Type": rideType, Details }
            currentRideArray.push(myJson);
        }
    }
    return currentRideArray;
}