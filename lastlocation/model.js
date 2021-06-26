import {Schema, model} from 'mongoose';

const location = new Schema({
    
           userId:{type:String, required:true },
           locations:[]
    
});

export default model('location', location);