import { sendFireBaseMessage } from '../firebase/firebase';
import { CANCELLED, COMPLETED, ONGOING } from './const';
import {
    getUserOfferRides, getUserBookRides, getBookRideDetails,
    getRideotp, getRideDateTime, changePassengerRideStatus,
    getCurrentRideDetails, changeRideStatusToCancel, rideStartedByDriver, driverridestatus,
    passengerridestatus, driverCompletedHisRide, updatePassengerStatusByUserId,
    perRidePassengerCost, rideCancelByDriver
} from './dbHelper';
const fs = require('fs');
import * as openpgp from 'openpgp'
import { makeCurrentRideArray } from './helper';
import { Console } from 'winston/lib/winston/transports';



export const currentRide = async (req, res, next) => {
    try {
        const { _id } = req.body;

        const bookRidesForUser = await getUserBookRides(_id);
        const bookedRides = await makeCurrentRideArray(bookRidesForUser, 'BookRide');

        const offerRidesForuser = await getUserOfferRides(_id);
        const offeredRides = await makeCurrentRideArray(offerRidesForuser, 'OfferRide');
        return res.status(200).json([...bookedRides, ...offeredRides]);
    } catch (error) {
        next(error);
    }
}

export const currentrideDetails = async (req, res, next) => {
    try {
        const { ride_id } = req.body;
        const rideDetails = await getCurrentRideDetails(ride_id);
        return res.status(200).send({ rideDetails, total: 0 });
    } catch (error) {
        next(error);
    }
}


export const completedRides = async (req, res, next) => {
    try {

        const { _id } = req.body;

        const bookRidesForUser = await getUserBookRides(_id);
        const bookedRides = await makeCurrentRideArray(bookRidesForUser, 'BookRide', 'COMPLETED');

        const offerRidesForuser = await getUserOfferRides(_id);
        const offeredRides = await makeCurrentRideArray(offerRidesForuser, 'OfferRide', 'COMPLETED');

        // console.log('completedRide', JSON.stringify([...bookedRides, ...offeredRides]));
        return res.status(200).json([...bookedRides, ...offeredRides]);

    } catch (error) {
        next(error);
    }
}

export const historyrideDetails = async (req, res, next) => {
    try {
        const { ride_id } = req.body;
        const rideDetails = await getCurrentRideDetails(ride_id);
        return res.status(200).send(rideDetails);
    } catch (error) {
        next(error);
    }
}

export const getRideOTP = async (req, res, next) => {
    try {

        const { userId, ride_id } = req.body;
        const otp = await getRideotp(ride_id, userId);
        return res.status(200).send(otp);
    } catch (error) {
        next(error);
    }
}

export const verifyRideOTP = async (req, res, next) => {
    try {

        const { userId, ride_id, otp } = req.body;
        const rideotp = await getRideotp(ride_id, userId);
        console.log(rideotp, req.body);
        if (rideotp.OTP.toString() !== otp) return res.status(500).send({ "Failed": "Otp not correct" });

        await updatePassengerStatusByUserId(ride_id, userId, ONGOING);
        //...use sendfirebase
        //sendfirebase();
        return res.status(200).send({ "Success": "Ride Started" });

    } catch (error) {
        next(error);
    }
}

export const passengerRideCompleted = async (req, res, next) => {
    try {
        const { ride_id, userId } = req.body;
        await updatePassengerStatusByUserId(ride_id, userId, COMPLETED);
        const amount = await perRidePassengerCost(ride_id, userId);
        console.log(amount);
        return res.status(200).send({ "Ride": "Completed", "Amount": amount });
    } catch (error) {
        next(error);
    }
}

export const driverstartride = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        await rideStartedByDriver(ride_id);
        //... will add firebase
        //sendFireBaseMessage();
        return res.status(200).send({ "Ride": "Started" });
    } catch (error) {
        next(error);
    }
}

export const driverstatusCompleted = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        const total = await driverCompletedHisRide(ride_id);

        return res.status(200).send({ "Ride": "Completed", total });
    } catch (error) {
        next(error);
    }
}

export const driverCancelRide = async (req, res, next) => {
    try {
        const { ride_id } = req.body;
        await rideCancelByDriver(ride_id);
        //... will add firebase
        //sendFireBaseMessage();

        return res.status(200).send({ datetime });


    } catch (error) {
        next(error);
    }
}

export const passengerCancelRide = async (req, res, next) => {
    try {
        const { ride_id, userId } = req.body;
        await updatePassengerStatusByUserId(ride_id, userId, CANCELLED);
        //... will add firebase
        //sendFireBaseMessage();

        return res.status(200).send({ datetime });


    } catch (error) {
        next(error);
    }
}

// export const drivercancelRide = async (req, res, next) => {
//     try {
//         const { userId, ride_id } = req.body;
//         const datetime = await getRideDateTime(ride_id, userId);

//         var today = new Date();
//         var day = today.getDate();
//         var mon = today.getMonth() + 1;
//         var year = today.getFullYear();
//         today = (mon + " " + day + "," + year);
//         console.log(today);
//         //var todayDate = new Date(today)
//         var time = new Date();
//         var currentTime = time.getHours() + ":" + time.getMinutes();
//         console.log(currentTime);
//         const date = datetime.Date;
//         const [rday, rmonth, ryear] = date.split('-');
//         const dateObj = { rmonth, rday, ryear };
//         const rideDate = dateObj.rmonth + ' ' + dateObj.rday + ',' + dateObj.ryear;
//         const str = datetime.Time;
//         const rtime = str.substring(0, str.length - 2)
//         console.log(rtime);


//         var dt1 = new Date(today + " " + currentTime);
//         var dt2 = new Date(rideDate + " " + "4:00");


//         var diff = (dt2.getTime() - dt1.getTime()) / 1000;
//         diff /= (60 * 60);
//         const hrDiff = Math.abs(Math.round(diff));
//         console.log(hrDiff);
//         if (hrDiff > 1) {
//             await changeRideStatusToCancel(ride_id, userId);
//         }
//         console.log(Math.abs(Math.round(diff)));

//         return res.status(200).send({ datetime });


//     } catch (error) {
//         next(error);
//     }
// }

export const getdriverridestatus = async (req, res, next) => {

    try {
        const { ride_id } = req.body;
        const status = await driverridestatus(ride_id);
        return res.status(200).send({ status });
    }
    catch (error) {
        next(error);
    }

}

export const getpassengerridestatus = async (req, res, next) => {

    try {
        const { user_id, ride_id } = req.body;
        const status = await passengerridestatus(ride_id, user_id);
        return res.status(200).send({ status });
    }
    catch (error) {
        next(error);
    }

}

export const pgpGeneator = async (req, res, next) => {

    try {
        console.log("keys generator");

        const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
            type: 'ecc', // Type of the key, defaults to ECC
            curve: 'curve25519', // ECC curve name, defaults to curve25519
            userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
            passphrase: 'super long and hard to guess secret', // protects the private key
            format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
        });
        fs.readFile('privatekey.txt', 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            console.log("asdfghjkl" + data)
          })
        console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
        console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
        return { privateKey, publicKey, revocationCertificate };
        return res.status(200).send({ privateKey, publicKey });

        console.log(revocationCertificate);


    }
    catch (error) {
        next(error);
    }

}


export const encryptDcrypt = async (req, res, next) => {
    
    try {
        
        const publicKeyArmored = await fs.readFileSync('publickey.asc', 'utf8' , (err, publicKeyArmored) => {
            if (err) {
              console.error(err)
              return
            }
            return publicKeyArmored;
            
          })

        const privateKeyArmored =  await fs.readFileSync('privatekey.asc', 'utf8' , (err, privateKeyArmored) => {
            if (err) {
              console.error(err)
              return
            }

            return privateKeyArmored;
            
          })
          console.log("asdfghjkl" + publicKeyArmored)
          console.log("asdfghjkl" + privateKeyArmored)

        // const pgpGenerated = await pgpGeneator(req, res, next);
        // const publicKeyArmored = pgpGenerated.publicKey;
        // const privateKeyArmored = pgpGenerated.privateKey;
        

        const passphrase = `super long and hard to guess secret`; // what the private key is encrypted with
        console.log('readKey');
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
        console.log('publicKey');
        const privateKey = await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
            passphrase
        });

        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: 'Hello, World!' }), // input as Message object
            encryptionKeys: publicKey,
            signingKeys: privateKey // optional
        });
         // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

        const message = await openpgp.readMessage({
            armoredMessage: encrypted // parse armored message
        });
        const { data: decrypted, signatures } = await openpgp.decrypt({
            message,
            verificationKeys: publicKey, // optional
            decryptionKeys: privateKey
        });
        console.log(decrypted); // 'Hello, World!'
        return res.status(200).send({ "Success": "Success" });



    }
    catch (error) {
        next(error);
    }

}
