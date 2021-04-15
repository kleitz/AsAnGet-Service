import axios from 'axios';
import model from './model';
import {INSTAGRAM} from './constant';
import {instagram} from 'instagram-node';
import {tokenForUser} from './helper';

const api = instagram();

api.use({
     client_id: '1101517720330337',
     client_secret: 'c3ce4de1fb8f7e31afbd48e95f3bb8e9'
});

export const instagramAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        const response = await axios.get(`${process.env.instagramAuthUrl}${token}`);        
        if(!response) return Promise.reject("invalid token");
        const instagram_id = response.data.id;
        const name = response.data.username;
        const email = response.data.email;
        const existUser = await model.findOne({ socialMediaId: instagram_id });
        if(!existUser){
            const newUser = new model({
                socialMediaId: instagram_id,
                socialMediaName: INSTAGRAM,
                email: email,
                name: name
              });
              await newUser.save();
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id});
        }
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id})
    } catch (error) {
        next(error);
    }
}
