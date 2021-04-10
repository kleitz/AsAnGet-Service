import model from './model';
import {FACEBOOK} from './constant';
import axios from 'axios';

export const facebookAuth = async (req, res, next) => {
    try {
        console.log("facebook");
        const token = req.body.token;
        
        const response = await axios.get(`${process.env.facebookAuthUrl}${token}`);
        if(!response) return Promise.reject("invalid token");
        console.log("Token is authorized");
        const facebook_id = response.data.id;
        const name = response.data.name;
        const email = response.data.email;
        const existUser = await model.findOne({ socialMediaId: facebook_id });
        if(!existUser){
            const newUser = new User({
                socialMediaId: facebook_id,
                socialMediaName: FACEBOOK,
                email: email,
                name: name
              });
              await newUser.save();
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id});
        }
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id})
    } catch (error) {
        return Promise.reject(error);
    }
}