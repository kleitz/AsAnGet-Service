import {Schema, model} from 'mongoose';

const ratings = new Schema({
    
           ratingUserId:{type:String },
           ratedUserId:{type:String},
           review:{type:String},
            role:{type: String},
            rate:{type:Number},
            remark:[{type:String}],
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

export default model('ratings', ratings);