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
    homeaddress:{type: String},
    officeaddress:{type: String},

    cars: [
        { 
            category:{type:String, required: true}, 
            model:{type:String, required: true},
            seats:{type:Number, required: true},
            carNo:{type:Number, required: true},
            ridescompletedbycar:{type:Number, default:0}
            
        }
    ]
});


export default model('User', User);