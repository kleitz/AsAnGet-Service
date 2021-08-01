import axios from 'axios';
import model from './model';
import {FACEBOOK} from './constant';
import {tokenForUser} from './helper';

/*hit facebook api
 generate token 
 hit third party facebook url
 get name,email,url,facebook id */ 

export const facebookAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        const response = await axios.get(`${process.env.facebookAuthUrl}${token}`); //save facebook token in response 

        if(!response) return Promise.reject("invalid token");/*if no response then return invalid token
        else return token of existing user*/
        const facebook_id = response.data.id;
        const name = response.data.name;
        const email = response.data.email;
        const url = response.data.picture.data.url;
        const existUser = await model.findOne({ socialMediaId: facebook_id });
        if(!existUser){ /*if user doesn't exist then create new user according to model
        else return token of newUser*/

            const newUser = new model({
                socialMediaId: facebook_id,
                socialMediaName: FACEBOOK,
                email: email,
                name: name,
                imageUrl: url
              });
              await newUser.save();//save user as newUser
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id,url:newUser.imageUrl,email:newUser.email});
        }
        const noOfCars = existUser.cars[0].length();
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id,url:existUser.imageUrl,email:existUser.email});
    } catch (error) {
        next(error)
    }
}