
import {Schema, model} from 'mongoose';

const User = new Schema({
    email: {type: String},
    name: {type: String},
    socialMediaName:{type: String},
    socialMediaId:{type: String},
    createdDate:{type: Date, default: Date.now},
    imageUrl:{type:String},
    age:{type:Number},
    phoneNum:{type:Number},
    rating:{type:Number},
    puntuality:{type: Number},
    cars: [
        { 
            carId:{type:String}, 
            maker:{type:String},
            type:{type:String}
            
        }
    ]
});


export default model('User', User);