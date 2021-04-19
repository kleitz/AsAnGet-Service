import model from './model';
import {GOOGLE} from './constant';
import {tokenForUser} from './helper';

import {OAuth2Client} from 'google-auth-library';
const CLIENT_ID = `${process.env.clientIDgoogle}`;


const client = new OAuth2Client(CLIENT_ID);

export const googleAuth = async (req, res, next) => {
    try {
            const token = req.body.token;
            console.log(token);
            console.log("verify")
            const ticket = await client.verifyIdToken({idToken: token,audience: CLIENT_ID});
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            const google_id = userid;
            const name = payload.name;
            const email = payload.email;
            console.log(userid + name + email);
            const existUser = await model.findOne({ socialMediaId: google_id });
            if(!existUser){
                console.log("user not exist");    
                const newUser = new model({
                socialMediaId: google_id,
                socialMediaName: GOOGLE,
                email: email,
                name: name
              });
              console.log(newUser);
              await newUser.save();
              console.log("new user saved");  
              
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id});
            }
            console.log("user exist");
            
            return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id})
        }catch(error){
        next(error)
    }
}
