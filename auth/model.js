
import {Schema, model} from 'mongoose';

const User = new Schema({
    email: {type: String},
    name: {type: String},
    socialMediaName:{type: String},
    socialMediaId:{type: String},
    createdDate:{type: Date, default: Date.now}
});


export default model('User', User);