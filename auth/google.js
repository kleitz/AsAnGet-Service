import model from './model';
import {GOOGLE} from './constant';
import {tokenForUser} from './helper';

import {OAuth2Client} from 'google-auth-library';

const CLIENT_ID = process.env.clientIDgoogle;
const client = new OAuth2Client(CLIENT_ID);

/*hit google api
 generate token 
 verify the token 
 get userid,name,email,url,google id,img url */ 

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
            const imgurl = payload.picture;
            const existUser = await model.findOne({ socialMediaId: google_id });
            if(!existUser){
              /*if user doesn't exist then create new user according to model
            else return token of newUser
            if exist return token of existUser*/
                console.log("user not exist");    
                const newUser = new model({
                socialMediaId: google_id,
                socialMediaName: GOOGLE,
                email: email,
                name: name,
                imageUrl: imgurl
              });
              console.log(newUser);
              await newUser.save();
              console.log("new user saved");  
              
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id,url:newUser.imageUrl,email:newUser.email, cars:"0"});
            }
            console.log("user exist");
            
            return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id,url:existUser.imageUrl,email:existUser.email, cars:existUser.cars.length});
        }catch(error){
        next(error)
    }
}
