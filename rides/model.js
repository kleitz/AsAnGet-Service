import {Schema, model} from 'mongoose';




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
  }, 
  status: {
    type: String, // Number type
    default:'Upcoming',
  },
  firebaseTopic:{
    type: String
  },
  active: {
    type: Boolean,
    default: true
},
createdDate: {
    type: Date,
    default: Date.now
},

modifiedDate: {
    type: Date,
    default: Date.now
},

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
  userId:{
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
  }, 
  status: {
    type: String, // Number type
    default:'Upcoming',
  },
  OTP: {
    type: Number,
    required: true,
  },
  firebaseTopic:{
    type: String
  },
  active: {
    type: Boolean,
    default: true
},
createdDate: {
    type: Date,
    default: Date.now
},

modifiedDate: {
    type: Date,
    default: Date.now
},
Type:{
  type: String,
  default:'BookRide'
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
    },
    active: {
      type: Boolean,
      default: true
  },
  createdDate: {
      type: Date,
      default: Date.now
  },

  modifiedDate: {
      type: Date,
      default: Date.now
  },
  });

  


export default model('Ride', Ride);