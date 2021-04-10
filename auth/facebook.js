import axios from 'axios';
import model from './model';
import {FACEBOOK} from './constant';
import {tokenForUser} from './helper';


export const facebookAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        const response = await axios.get(`${process.env.facebookAuthUrl}${token}`);

        if(!response) return Promise.reject("invalid token");
        const facebook_id = response.data.id;
        const name = response.data.name;
        const email = response.data.email;
        const existUser = await model.findOne({ socialMediaId: facebook_id });
        if(!existUser){
            const newUser = new model({
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
        next(error)
    }
}