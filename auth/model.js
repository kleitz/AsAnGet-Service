
import {Schema, model} from 'mongoose';

const Test = new Schema({
    name: { type: String, default: 'hahaha' },
    age: { type: Number },
    bio: { type: String },
    date: { type: Date, default: Date.now }
  });

export default model('Test', Test);