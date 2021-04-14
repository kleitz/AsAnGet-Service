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

//const redirect_uri = process.env.INSTANGRAM_BASE_URL + '/instagram_auth';

export const instagramAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        
        console.log(token);
        
        
        const response = await axios.get(`${process.env.instagramAuthUrl}${token}`);
        console.log('abcd', response.data);
        if(!response) return Promise.reject("invalid token");
        
        const instagram_id = response.data.id;
        const name = response.data.username;
        console.log(name);

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
              console.log("new user");
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id});
        }
        console.log("exist user");
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id})
    } catch (error) {
        next(error);
    }
}
