import {Schema, model} from 'mongoose';

//offer ride schema
// [{
//   "from":"",
//   "to":"" ,
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


const OfferRideSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  carType: {
    type: String,
  },
  time: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  passengers: [],
  // Do we add a max number of seats
  noOfSeats: {
    type: Number,
    
  },
  pricePerSeat: {
    type: Number
  },

  pricePerBag:{
    type: Number
  },
  currency: {
    type: String
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
  end_loactions:[],
  bigBagNo:{
    type: Number
  },
  noOfPauses:{
    type: Number
  },
  smoking: {
    type: Boolean
  },
  petAllow: {
    type: Boolean
  },
  foodAllow:{
    type: Boolean
  }

});

const RequestRideSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  passengers: [],
  // Do we add a max number of seats
  noOfSeats: {
    type: Number,
    
  },
  bigBagNo:{
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
  }

});

const Ride = new Schema({
    userId:{
      type:String,
      required:true
    },
    offerRides:[OfferRideSchema],
    
    requestRides:[RequestRideSchema],

    type: {
      type: String,
      required: false,
      enum: ['offer', 'request'],
    }
  });

  


export default model('Ride', Ride);