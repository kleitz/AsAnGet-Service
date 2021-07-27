import {Schema, model} from 'mongoose';

const User = new Schema({
    email: {type: String}, /*stores the email of the user*/ 
    name: {type: String}, /*stores the name of the user*/ 
    socialMediaName:{type: String}, /*stores the socialMediaName of the user*/ 
    socialMediaId:{type: String},  /*stores the socialMediaId of the user*/ 
    createdDate:{type: Date, default: Date.now},   /*stores on which date, the particular entry is added  */  
    imageUrl:{type:String}, /*stores the image of the user*/ 
    age:{type:Number},  /*stores the age of the user*/ 
    phoneNum:{type:Number}, /*stores the phoneNum of the user*/ 
    rating:{type:Number}, /*stores the rating of the user*/ 
    homeaddress:{type: String},  /*stores the homeaddress of the user*/ 
    officeaddress:{type: String},  /*stores the officeaddress of the user*/ 

    cars: [
        { 
            category:{type:String, required: true}, 
            model:{type:String, required: true},
            seats:{type:Number, required: true},
            carNo:{type:Number, required: true},
            ridescompletedbycar:{type:Number, default:0}
            
        }
    ]
});/*stores the car details of the user*/ 


export default model('User', User);