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
      type: [String],
      required: false,
    },
    // Do we add a max number of seats
    seats_avail: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    }
    
  });


export default model('Ride', Ride);