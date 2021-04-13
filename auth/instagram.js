import axios from 'axios';
import model from './model';
import {INSTAGRAM} from './constant';
import {instagram} from 'instagram-node';

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
        const response = await axios.get( 'https://api.instagram.com/oauth/authorize?fields=id,name,email&access_token={token}');
        console.log("ewsponse is vid");
        if(!response) return Promise.reject("invalid token");
        console.log(response.data.id);
        const instagram_id = response.data.id;
        const name = response.data.name;
        const email = response.data.email;
        console.log(name);
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
