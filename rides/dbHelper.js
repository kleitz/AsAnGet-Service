import model from './model';
import {getbyId} from '../auth/dbHelper';


export const saveRideInDB = async(newRide) => {
    try {
        const obj = await new model(newRide);
        await obj.save();
        return {RideID :obj._id};
    } catch (error) {
        return Promise.reject(err);
    }
}

export const getAllRides = async(user_id) => {
    try {
        const rides = await model.find();
        return rides;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getRideDetails = async(ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        const driverId = ridesDetails.userId;
        const driverDetails = await getbyId(driverId);
        const requestRides = ridesDetails.requestRides;
        var passengers = [];
        console.log(driverDetails);
        for(let index = 0 ; index< requestRides.length ; index++){
            const passengerId = requestRides[index].userId;
            const passengerDetails = await getbyId(passengerId);
            console.log(passengerDetails);
            passengers.push({user_id:requestRides[index].userId,date:requestRides[index].date,time:requestRides[index].time,name:passengerDetails.existUser.name,imageUrl:passengerDetails.existUser.imageUrl})
        }
        return {Name: driverDetails.existUser.name, ProfileUrl:driverDetails.existUser.imageUrl,carType:ridesDetails.offerRides[0].carType,
            from:ridesDetails.offerRides[0].from , to:ridesDetails.offerRides[0].to  ,Time:ridesDetails.offerRides[0].time, Date:ridesDetails.offerRides[0].date, NoOfSeats:ridesDetails.offerRides[0].noOfSeats,
            NoOfBags:ridesDetails.offerRides[0].bigBagNo,smoking:ridesDetails.offerRides[0].smoking,petAllow:ridesDetails.offerRides[0].petAllow,
            noOfPauses:ridesDetails.offerRides[0].noOfPauses, foodAllow:ridesDetails.offerRides[0].foodAllow, Passengers:passengers
            
        };
    } catch (error) {
        return Promise.reject(error);
    }
}

export const bookRideSaveinDb = async(newRide) => {
    try {
        const ride = await model.findOne({ _id: newRide.id });
        ride.requestRides.push(newRide);
        await ride.save();
    } catch (error) {
        return Promise.reject(error);
    }
}
export const getUserOfferRides = async(userId) => {
    try {
        const Rides = await model.find( { userId: userId } )
        return Rides;
        
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getUserBookRides = async(userId) => {
    try {
        const Rides = await model.find({"requestRides.userId":userId})
        return Rides;
    } catch (error) {
        return Promise.reject(error);
    }
}



export const getBookRideDetails = async(ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        const driverId = ridesDetails.userId;
        const driverDetails = await getbyId(driverId);
        const requestRides = ridesDetails.requestRides;
        var passengers = [];
        
        for(let index = 0 ; index< requestRides.length ; index++){
            const passengerId = requestRides[index].userId;
            const passengerDetails = await getbyId(passengerId);
            
            passengers.push({name:passengerDetails.existUser.name?? '',imageUrl:passengerDetails.existUser.imageUrl?? '', userId:requestRides[index].userId,status:requestRides[index].status})

        }
        return {RideId:ridesDetails._id,From:ridesDetails.offerRides[0].from,To:ridesDetails.offerRides[0].to,
            Time:ridesDetails.offerRides[0].time, Date:ridesDetails.offerRides[0].date,
            carType:ridesDetails.offerRides[0].carType,status:ridesDetails.offerRides[0].status,
             Passengers:passengers};
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getRideotp = async(ride_id,userId) => {
    try {
        const ridesDetails = await model.findOne({ "_id": ride_id,"requestRides.userId" :userId });
        const requestRides = ridesDetails.requestRides;
        
        for(let index=0; index < requestRides.length ;index++)
        {
            if(userId == requestRides[index].userId)
            {
                var otp = requestRides[index].OTP;
            }
        }
        
        return {OTP : otp};
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changeRideStatus = async(ride_id,user_Id) => {
    try {
     
       await model.updateOne(
           {"_id":ride_id,"requestRides.userId" : user_Id , "requestRides.status" : "Upcoming"
        },
        { $set: { "requestRides.$.status" : "Ongoing"} 
         
    })
        
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changeRideStatusToCompleted = async(ride_id,user_Id) => {
    try {
     
       await model.updateOne(
           {"_id":ride_id,"requestRides.userId" : user_Id , "requestRides.status" : "Ongoing"
        },
        { $set: { "requestRides.$.status" : "Completed"} 
         
    })
    const seats = await model.findOne({"_id":ride_id,"requestRides.userId" : user_Id});
    const cost = await model.findOne({"_id":ride_id});
    const perseatcost = cost.offerRides[0].pricePerSeat;
    const perbagcost = cost.offerRides[0].pricePerBag;
    const passangerseats =  cost.requestRides[0].noOfSeats;
    const passangerbags =  cost.requestRides[0].bigBagNo;
    console.log(passangerseats);
    console.log(passangerbags);
    const total = ((perseatcost * passangerseats) + (perbagcost * passangerbags));
    console.log(passangerbags);

    return total;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getRideDateTime = async(ride_id,user_Id) => {
    try {
     
        
       const Details = await model.findOne({"_id":ride_id,"requestRides.userId" : user_Id },{ requestRides: 1});
       const a = Details.requestRides.filter(req=>(req.userId === user_Id))
       //console.log(a);
        return {Date : a[0].date , Time : a[0].time};
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getCurrentRideDetails = async(ride_id) => {
    try {
        const ridesDetails = await model.findOne({ _id: ride_id });
        console.log(ridesDetails);
        const driverId = ridesDetails.userId;
        const driverDetails = await getbyId(driverId);
        const requestRides = ridesDetails.requestRides;
        var passengers = [];
        
        for(let index = 0 ; index< requestRides.length ; index++){
            const passengerId = requestRides[index].userId;
            const passengerDetails = await getbyId(passengerId);
            //console.log(passengerDetails);
            passengers.push({userId:requestRides[index].userId, From:requestRides[index].from,
                To:requestRides[index].to,date:requestRides[index].date,
               time:requestRides[index].time,Status:requestRides[index].status,
               name:passengerDetails.existUser.name?? '',
               imageUrl:passengerDetails.existUser.imageUrl?? '',phoneNo :passengerDetails.existUser.phoneNum?? ''})
        }
        return {Name: driverDetails.existUser.name?? '', ProfileUrl:driverDetails.existUser.imageUrl?? '',
        phoneNum:driverDetails.existUser.phoneNum?? '', From:ridesDetails.offerRides[0].from,To:ridesDetails.offerRides[0].to,Time:ridesDetails.offerRides[0].time, Date:ridesDetails.offerRides[0].date, NoOfSeats:ridesDetails.offerRides[0].noOfSeats,
        pricePerSeat:ridesDetails.offerRides[0].pricePerSeat,  pricePerBag:ridesDetails.offerRides[0].pricePerBag,noOfSeats:ridesDetails.offerRides[0].noOfSeats
        ,NoOfBags:ridesDetails.offerRides[0].bigBagNo,smoking:ridesDetails.offerRides[0].smoking,petAllow:ridesDetails.offerRides[0].petAllow,
            noOfPauses:ridesDetails.offerRides[0].noOfPauses, foodAllow:ridesDetails.offerRides[0].foodAllow,status:ridesDetails.offerRides[0].status,
             Passengers:passengers
            
        };
    } catch (error) {
        return Promise.reject(error);
    }
}
export const changeRideStatusToCancel = async(ride_id,user_Id) => {
    try {
     
       await model.updateOne(
           {"_id":ride_id,"requestRides.userId" : user_Id , "requestRides.status" : "Upcoming"
        },
        { $set: { "requestRides.$.status" : "Cancelled"} 
         
    })
        
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const changecompleteride = async(ride_id,user_Id) => {
    try {
     
       await model.updateOne(
           {"_id":ride_id,"userId" : user_Id 
        },
        { $set: { "requestRides.$.status" : "Cancelled"} 
         
    })
        
        return ;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const driverstarthisride = async(ride_id) => {
    try {
     
       await model.updateOne(
           {_id:ride_id,"offerRides.status": "Upcoming"},
        { $set: { "offerRides.$.status" : "Ongoing"} })
    return;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const drivercompletehisride = async(ride_id) => {
    try {
     
       await model.updateOne(
           {_id:ride_id,"offerRides.status": "Ongoing"},
        { $set: { "offerRides.$.status" : "Completed"} })

        const passenger = await model.find({_id: ride_id});
        const price = passenger[0].offerRides[0].pricePerSeat;
        const bagprice = passenger[0].offerRides[0].pricePerBag;
        const details = passenger[0].requestRides;
        console.log(price);
        console.log(bagprice);
        
        
        var total = 0;
        for(var i=0; i<details.length; i++){
            if(details[i].status == 'Completed'){
                const seats = details[i].noOfSeats;
                const bags = details[i].bigBagNo;
                console.log(seats);
                console.log(bags);


                total = total + ((price*seats) + (bagprice*bags));
            }
        }
    return total;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const driverridestatus = async(ride_id) => {
    try {
     
       const data = await model.findOne({_id: ride_id});
       return data.offerRides[0].status;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const passengerridestatus = async(ride_id, user_id) => {
    try {
     
       const data = await model.findOne({"_id":ride_id,"requestRides.userId" : user_id});
       const requestRides = data.requestRides;
       var newdata = requestRides.filter(task =>{
         if(task.userId == user_id){
             return task.status;
         }
       });
      
       return newdata[0].status;
    } catch (error) {
        return Promise.reject(error);
    }
}

