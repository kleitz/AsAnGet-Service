import model from './model';
import {iNSTAGRAM} from './constant';

var api = require('instagram-node').instagram();
api.use({
    client_id: YOUR_CLIENT_ID,
    client_secret: YOUR_CLIENT_SECRET
});
var redirect_uri = process.env.INSTANGRAM_BASE_URL + '/handleauth';

export const instagramAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        const response = await axios.get( 'https://graph.instagram.com/me?fields=id,name,email&access_token={token}');
        
        if(!response) return Promise.reject("invalid token");
        const instagram_id = response.data.id;
        const name = response.data.name;
        const email = response.data.email;
        const existUser = await model.findOne({ socialMediaId: instagram_id });
        if(!existUser){
            const newUser = new User({
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
        return Promise.reject(error);
    }
}
