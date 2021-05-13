import {Schema, model} from 'mongoose';

//offer ride schema
// [{
//   "from":"",
//   "to":"" ,
//   "togeo": "",
//   "time":"",
//   "date": "",
//   "passengers": "",
//   "noOfSeats": "",
//   "notes": "",
//   "price": "",
//   "recurringRideStartDate":"",
//   "recurringRideEndDate":"",
//   "recurringRideTime":"",
//   "startLatLog":[],
//   "endLatLog":[]
  
// }]


// request ride schema
// [
//   {
//   "from":"",
//   "to":"" ,
//   "togeo": "",
//   "time":"",
//   "date": "",
//   "passengers": "",
//   "noOfSeats": "",
//   "notes": "",
//   "recurringRideStartDate":"",
//   "recurringRideEndDate":"",
//   "recurringRideTime":"",
//   "startLoc":{}
//   "endLoc":{}
  
//   }
//   ]
const Ride = new Schema({
    userId:{
      type:String,
      required:false
    },
    offerRides:[],
    requestRides:[],

    type: {
      type: String,
      required: false,
      enum: ['offer', 'request'],
    },
     
    from: {
      type: String,
      required: true,
    },
    fromgeo: {
      type: Object,
      required: false,
    },
    to: {
      type: String,
      required: true,
    },
    togeo: {
      type: Object,
      required: false,
    },
    time: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    passengers: {
      type: [String]
    },
    // Do we add a max number of seats
    noOfSeats: {
      type: Number,
      required: true,
    },
    notes: {
      type: String
    },
    price: {
      type: Number
    },
    recurringRideStartDate:{
      type: String
    },
    recurringRideEndDate:{
      type: String
    },
    recurringRideTime:{
      type: String
    },
    start_locations:[],
    end_loactions:[]
    
  });


export default model('Ride', Ride);