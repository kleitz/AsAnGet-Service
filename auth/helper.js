import {encode, decode}  from 'jwt-simple';
import User from './model';

export const tokenForUser = (user) =>{
    const obj = {
      sub: user._id
    };
    const SECRET = process.env.JWT_SECRET;
    return encode(obj, SECRET);
  }

  export const requireAuth = async(req, res, next) =>{
      try {
        var authHeader = req.get('Authorization');
        const SECRET = process.env.JWT_SECRET;
        var jwtToken = decode(authHeader, SECRET);
        var user_id = jwtToken.sub;
        const user = await User.findById(user_id);
        if(!user) return Promise.reject("User not found");
        req.user = user;
        next();
      } catch (error) {
          return Promise.reject(error);
      }
    
  }
  