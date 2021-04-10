import model from './model';


import {OAuth2Client} from 'google-auth-library';
const CLIENT_ID = '26791416393-p3m4g25l4m26081mboqrg6e85hukl6vk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

export const googleAuth = async (req, res, next) => {
    try {
        
        const token = req.body.token;
        console.log(token);
        //...why use verify
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID, 
            
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            const google_id = payload.id;
            const name = payload.name;
            const email = payload.email;
            console.log(userid + google_id + name + email);
            const existUser = await model.findOne({ socialMediaId: google_id });
            if(!existUser){
            const newUser = new User({
                socialMediaId: google_id,
                socialMediaName: GOOGLE,
                email: email,
                name: name
              });
              await newUser.save();
              return res.status(200).json({token: tokenForUser(newUser),name:newUser.name,id:newUser._id});
        }
        return res.status(200).json({token: tokenForUser(existUser),name:existUser.name,id:existUser._id})
          }
          
        }
    catch{
        return Promise.reject(error);
    }
}
