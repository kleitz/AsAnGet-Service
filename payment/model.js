import { Schema, model } from 'mongoose';
import {INPROGRESS} from './const';

const payment = new Schema({

    orderId: { type: String, default:0 },
    userId: { type: String },
    rideId: { type: String },
    amount: { type: String },
    currency:{type: String},
    status: { type: String,default: INPROGRESS },
    transcation:{type: String, default:""},
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});

export default model('payment', payment);