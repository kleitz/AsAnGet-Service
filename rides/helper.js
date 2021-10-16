import { getBookRideDetails ,getRideWithDriverDetailsById } from './dbHelper';
import { getbyId } from '../auth/dbHelper';
import { getuserratingOutOf5 } from '../ratings/dbHelper';
import { sendFireBaseMessage, sendPushNotification } from '../firebase/firebase';

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
    return date1 >= date2;
}

export const getCurrentRide = async (bookOfferRide, rideId, rideCat) => {
    const status = bookOfferRide.status;
    const checkRideCompleted = isRideCompleted(status);
    const makeCurrentCondtionCheck = (rideCat === 'COMPLETED') ?
                                    checkRideCompleted : !checkRideCompleted;
    if (makeCurrentCondtionCheck) {
        return await getBookRideDetails(rideId);
    }
    return null;

}

const isRideCompleted = (status) => {
    return (status.trim() === "Completed");
}

export const makeCurrentRideArray = async (rides, rideType, rideCat) => {
    const currentRideArray = [];
    for (let index = 0; index < rides.length; index++) {
        const offerRide = rides[index].offerRides[0];
        const rideId = rides[index]._id;
        const Details = await getCurrentRide(offerRide, rideId, rideCat);
        if (Details) {
            var myJson = { "Type": rideType, Details }
            currentRideArray.push(myJson);
        }
    }
    return currentRideArray;
}

export const isPassengerAlreadyBookTheRide = (passangerList, passengerUserId)=>{
    for (var i = 0; i < passangerList.length; i++) {
        if (passangerList[i].userId === passengerUserId) {
            return true;
        }
    }
}

export const getDriverDetail = async(driverId) => {
    const driverDetails = await getbyId(driverId);
    const {rating5Star} = await getuserratingOutOf5(driverId,'driver');
    driverDetails.rating = rating5Star;
    return driverDetails;
}


export const sendMessageToAllPassenger = async(rideId,text,message) => {

    const {passengers} = await getRideWithDriverDetailsById(rideId);
        const allPassengerHasTopic = passengers.filter(p=>(p.firebaseTopic !== ''));
        const allTopics = allPassengerHasTopic.map(pass=>(pass.firebaseTopic));

        for (let index = 0; index < allTopics.length; index++) {
            const element = allTopics[index];
            console.log('topic passenger',element);
            sendFireBaseMessage({text}, element, message);  
        }
}
