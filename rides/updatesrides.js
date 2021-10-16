import { sendFireBaseMessage } from '../firebase/firebase';
import { CANCELLED, COMPLETED, ONGOING } from './const';
import {
    getUserOfferRides, getUserBookRides, getBookRideDetails,
    getRideotp, getCurrentRideDetails, driverridestatus,
    passengerridestatus, driverCompletedHisRide, updatePassengerStatusByUserId,
    perRidePassengerCost, rideCancelByDriver,getRideWithDriverDetailsById
} from './dbHelper';
const fs = require('fs');
import * as openpgp from 'openpgp'
import { makeCurrentRideArray,sendMessageToAllPassenger } from './helper';



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
        const rideDetails = await getBookRideDetails(ride_id);
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
        const {amount, currency} = await perRidePassengerCost(ride_id, userId);

        //sendFireBaseMessage({ text: 'Find ride Test' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');

        sendMessageToAllPassenger(ride_id,'You successfully completed your ride.','You successfully completed your ride.');

        return res.status(200).send({ "Ride": "Completed", "Amount": amount, currency });
    } catch (error) {
        next(error);
    }
}

export const driverstartride = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        // await rideStartedByDriver(ride_id);

        //... will add firebase
        // sendFireBaseMessage();
        const {passengers} = await getRideWithDriverDetailsById(ride_id);
        const allPassengerHasTopic = passengers.filter(p=>(p.firebaseTopic !== ''));
        const allTopics = allPassengerHasTopic.map(pass=>(pass.firebaseTopic));

        for (let index = 0; index < allTopics.length; index++) {
            const element = allTopics[index];
            sendFireBaseMessage({ text: 'Ride Started' }, element, 'Ride');  
        }

        //sendFireBaseMessage({ text: 'Find ride Test' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');

        
        
        return res.status(200).send({ "Ride": "Started" });
    } catch (error) {
        next(error);
    }
}

export const driverstatusCompleted = async (req, res, next) => {
    try {

        const { ride_id } = req.body;
        const {income, currency} = await driverCompletedHisRide(ride_id);

        return res.status(200).send({ "Ride": "Completed", total:income, currency });
    } catch (error) {
        next(error);
    }
}

export const driverCancelRide = async (req, res, next) => {
    try {
        const { ride_id } = req.body;
        await rideCancelByDriver(ride_id);
        
        //sendFireBaseMessage({ text: 'Your ride has been cancelled' }, 'eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR', 'Find Ride');

        sendMessageToAllPassenger(ride_id,'Your ride has been cancelled','Ride Cancel')
        return res.status(200).send({ desc:'success'});


    } catch (error) {
        next(error);
    }
}

export const passengerCancelRide = async (req, res, next) => {
    try {
        const { ride_id, userId } = req.body;
        await updatePassengerStatusByUserId(ride_id, userId, CANCELLED);
        
        const driverDetail = await getRideWithDriverDetailsById(ride_id);
        sendFireBaseMessage({ text: 'Passenger cancel ride' }, driverDetail.existUser.firebaseTopic, 'Passenger Cancel ride');

        return res.status(200).send({ desc:'success' });


    } catch (error) {
        next(error);
    }
}


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
        console.log('000000000000000000', encrypted);
        const message = await openpgp.readMessage({
            armoredMessage: encrypted // parse armored message
        });
        const { data: decrypted, signatures } = await openpgp.decrypt({
            message,
            verificationKeys: publicKey, // optional
            decryptionKeys: privateKey
        });
        console.log('signaturessignaturessignatures   ', signatures);
        console.log('   decrypteddecrypteddecrypted   ',decrypted); // 'Hello, World!'
        return res.status(200).send({ "Success": "Success" });



    }
    catch (error) {
        next(error);
    }

}

const readSecreteFile = async()=>{
    const privateKeyArmored =  await fs.readFileSync('privatekey.asc', 'utf8' , (err, privateKeyArmored) => {
        if (err) {
          console.error(err)
          return
        }

        return privateKeyArmored;
        
      })
    // console.log('---', privateKeyArmored);
    const passphrase = `super long and hard to guess secret`;
    const privateKey = await openpgp.readPrivateKey({ armoredKey:privateKeyArmored});
    // await privateKey.decrypt(passphrase);
    // const encryptedData = fs.readFileSync('./asanget_test_config.txt');
    const encryptedData =  await fs.readFileSync('asanget_test_config.txt', 'utf8' , (err, privateKeyArmored) => {
        if (err) {
          console.error(err)
          return
        }

        return privateKeyArmored;
        
      })
      console.log('encryptedData', encryptedData);
    const decrypted = await openpgp.decrypt({
        message: await openpgp.readMessage({
            armoredMessage: encryptedData // parse armored message
        }),
        decryptionKeys: privateKey
      });
      console.log(`successfully decrypted data... 👇`);
      console.log(decrypted.data);
}
