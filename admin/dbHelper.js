const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

import {getAllRides} from '../rides/dbHelper';
import { getUserBookRides } from '../rides/dbHelper';
import { changeRideStatusToCancel } from '../rides/dbHelper';
import { adminlogin } from './controller';

export const getrequestrides = async(newCar) => {
    try {
        const rides = await getAllRides();
        const created= await rides.filter(r => (r.active));

        const completed = await getUserBookRides();
        const cancelled = await changeRideStatusToCancel();
        return{
             created,
             completed,
             cancelled

        };
   
    } catch (error) {
        return Promise.reject(error);
    }
}
/*
export const getrequestridesdetails = async() => {
    try {
        const rides = await getAllRides.length();
        const completed = await getUserBookRides.length();
        const cancelled = await changeRideStatusToCancel.length();
        return {
               rides,
               completed,
               cancelled
        };
   
    } catch (error) {
        return Promise.reject(error);
    }
}
*/
export const validate = async () => {
    try {
        return adminlogin.findOne({ username: process.env.adminUsername}).exec().then((u) => {
            console.log('process.env.password, admin.password', u);
            if (u) {
                const payload = { username: u.name};
                const options = { expiresIn: '1d', issuer: process.env.ISSUER };

                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options);


                const match = bcrypt.compareSync(process.env.password, u.password);
                if(match){
                   return u.updateOne({token}).then(()=>{
                       
                        return { match, token, payload };
                    });
                }
                return {match};
            }

            return Promise.reject("Invalid Credentials");
        });

    } catch (err) {
        return Promise.reject(err);
    }
}
