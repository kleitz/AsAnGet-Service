import { sendFireBaseMessage } from '../firebase/firebase';
import { CANCELLED, COMPLETED, ONGOING } from './const';
import {
    getUserOfferRides, getUserBookRides, getBookRideDetails,
    getRideotp, getRideDateTime, changePassengerRideStatus,
    getCurrentRideDetails, changeRideStatusToCancel, rideStartedByDriver, driverridestatus,
    passengerridestatus, driverCompletedHisRide, updatePassengerStatusByUserId,
    perRidePassengerCost, rideCancelByDriver
} from './dbHelper';

import * as openpgp from 'openpgp'
import { makeCurrentRideArray } from './helper';



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
        console.log(rideotp,req.body);
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
        const { ride_id,userId } = req.body;
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
            console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
            console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
            return res.status(200).send({ privateKey, publicKey });
           
            console.log(revocationCertificate); 
           
          
    }
    catch (error) {
        next(error);
    }

}


export const encryptDcrypt = async (req, res, next) => {

    try {
        const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----xjMEYSORHRYJKwYBBAHaRw8BAQdA8d55exX0wmVIV9GWbsF991oqV88wsbJV
        +Mwe2cSDJQXNG0pvbiBTbWl0aCA8am9uQGV4YW1wbGUuY29tPsKMBBAWCgAd
        BQJhI5EdBAsJBwgDFQgKBBYAAgECGQECGwMCHgEAIQkQADfvdax2dj8WIQTy
        hgYJN7MNYQIS21wAN+91rHZ2P/UxAP9iTSJ3ZrShqJR33sVPEILwBhxDGEyS
        Nf3vkvUApxrxkAEA4affT+ICqoclwqLrXv3kD5pFTVlIRKeSbNBxvXebYA/O
        OARhI5EdEgorBgEEAZdVAQUBAQdAL9lFtFD+vV6o9KlnrCcJWQq8EkKc4qCZ
        h9gfzzI6CDQDAQgHwngEGBYIAAkFAmEjkR0CGwwAIQkQADfvdax2dj8WIQTy
        hgYJN7MNYQIS21wAN+91rHZ2P3MWAP4kGG19diE4T8cewlbSHH2YBMFZv+8s
        10qY9soL1Y4jlwEAme290RiUv9lOfqC2Yy4A1To7MELgCPz2yMmcdFmlyQU=
        =O4DX-----END PGP PUBLIC KEY BLOCK-----`;
        
            const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----xYYEYSORHRYJKwYBBAHaRw8BAQdA8d55exX0wmVIV9GWbsF991oqV88wsbJV
+Mwe2cSDJQX+CQMIo6U9KOfNGIDgF9Nt/NxwzhWlkdAtj1qd/bzlZz/Nt8PY
7Y8lrk+wBbw5eILOxdwqY+rQ7B/nuRYSvGBjn0eaGHWvNslIyyll/5vubtya
Tc0bSm9uIFNtaXRoIDxqb25AZXhhbXBsZS5jb20+wowEEBYKAB0FAmEjkR0E
CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRAAN+91rHZ2PxYhBPKGBgk3sw1h
AhLbXAA373WsdnY/9TEA/2JNIndmtKGolHfexU8QgvAGHEMYTJI1/e+S9QCn
GvGQAQDhp99P4gKqhyXCoute/eQPmkVNWUhEp5Js0HG9d5tgD8eLBGEjkR0S
CisGAQQBl1UBBQEBB0Av2UW0UP69Xqj0qWesJwlZCrwSQpzioJmH2B/PMjoI
NAMBCAf+CQMIYdo3odbDFH3guyv9WQJKvl2hiyoMJ2Yij8Gwpoowu0PfDePu
ZuU7no3jhoQOi0uF4PfXqU2yvi0f9b2EKisXrCJ6XX8C34idniSmOVlsVsJ4
BBgWCAAJBQJhI5EdAhsMACEJEAA373WsdnY/FiEE8oYGCTezDWECEttcADfv
dax2dj9zFgD+JBhtfXYhOE/HHsJW0hx9mATBWb/vLNdKmPbKC9WOI5cBAJnt
vdEYlL/ZTn6gtmMuANU6OzBC4Aj89sjJnHRZpckF
=zIf9
-----END PGP PRIVATE KEY BLOCK-----`; // encrypted private key
            const passphrase = `super long and hard to guess secret`; // what the private key is encrypted with
            
            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
        
            const privateKey = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
                passphrase
            });
        
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: 'Hello, World!' }), // input as Message object
                encryptionKeys: publicKey,
                signingKeys: privateKey // optional
            });
            console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
        
            const message = await openpgp.readMessage({
                armoredMessage: encrypted // parse armored message
            });
            const { data: decrypted, signatures } = await openpgp.decrypt({
                message,
                verificationKeys: publicKey, // optional
                decryptionKeys: privateKey
            });
            console.log(decrypted); // 'Hello, World!'
            return res.status(200).send({ privateKey, publicKey });
            
           
          
    }
    catch (error) {
        next(error);
    }

}
