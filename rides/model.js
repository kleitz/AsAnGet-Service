import {Schema, model} from 'mongoose';

const Ride = new Schema({
    type: {
      type: String,
      required: false,
      enum: ['offer', 'request'],
    },
    username: {
      type: String,
      required: true,
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
    }
    
  });


export default model('Ride', Ride);