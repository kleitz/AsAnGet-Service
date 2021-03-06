import axios from 'axios';
import model from './model';
import {FACEBOOK} from './constant';
import {tokenForUser} from './helper';
import {getuserratingOutOf5} from '../ratings/dbHelper';


export const facebookAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        const response = await axios.get(`${process.env.facebookAuthUrl}${token}`);

        if(!response) return Promise.reject("invalid token");
        const facebook_id = response.data.id;
        const name = response.data.name;
        const email = response.data.email;
        const url = response.data.picture.data.url;
        const existUser = await model.findOne({ socialMediaId: facebook_id });
        if(!existUser){
            const newUser = new model({
                socialMediaId: facebook_id,
                socialMediaName: FACEBOOK,
                email: email,
                name: name,
                imageUrl: url
              });
              await newUser.save();

              //sendFireBaseMessage({ text: 'Find ride Test' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');


              return res.status(200).json({token: tokenForUser(newUser),
                name:newUser.name,id:newUser._id,url:newUser.imageUrl,
                email:newUser.email,cars:"0", loginFrom: "Facebook",
                rating:{rating5Star:1, userRatedByCount:0}});
        }
        const rating = await getuserratingOutOf5(existUser._id, 'driver');
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id,
            url:existUser.imageUrl,email:existUser.email, cars:existUser.cars.length, 
            loginFrom: "Facebook",rating});
    } catch (error) {
        next(error)
    }
}