import {Schema, model} from 'mongoose';

const rating = new Schema({
    
           ratingUserId:{type:String },
           ratedUserId:{type:String},
           review:{type:String},
            role:{type: String},
            rate:{type:Number}
    
});

export default model('rating', rating);