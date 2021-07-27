import {Schema, model} from 'mongoose';

const ratings = new Schema({
    
           ratingUserId:{type:String },
           ratedUserId:{type:String},
           review:{type:String},
            role:{type: String},
            rate:{type:Number},
            remark:[{type:String}],

    
});

export default model('ratings', ratings);