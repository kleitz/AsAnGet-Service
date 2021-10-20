import axios from 'axios';
import model from './model';
import {INSTAGRAM} from './constant';
import {instagram} from 'instagram-node';
import {tokenForUser} from './helper';
import {getuserratingOutOf5} from '../ratings/dbHelper';

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
        const instagram_id = response.data.data[0].id;
        const name = response.data.data[0].username;
        const email = response.data.data[0].email;
        const url = response.data.data[0].media_url;
        console.log(response.data.data);
        console.log(response.data.data[0].username);
        console.log(instagram_id);
        const existUser = await model.findOne({ socialMediaId: instagram_id });
        if(!existUser){
            const newUser = new model({
                socialMediaId: instagram_id,
                socialMediaName: INSTAGRAM,
                email: email,
                name: name,
                imageUrl: url
                
              });
              await newUser.save();

              //sendFireBaseMessage({ text: 'Find ride Test' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');


              return res.status(200).json({token: tokenForUser(newUser),
                name:newUser.name,id:newUser._id,url:newUser.imageUrl,email:newUser.email, 
                loginFrom: "Instagram",rating:{rating5Star:1, userRatedByCount:0}});
        }
        const rating = await getuserratingOutOf5(existUser._id, 'driver');
        return res.status(200).json({token: tokenForUser(existUser),
            name:existUser.name,id:existUser._id,url:existUser.imageUrl,email:existUser.email,
            cars:existUser.cars.length, loginFrom: "Instagram",rating});
    } catch (error) {
        next(error);
    }
}
