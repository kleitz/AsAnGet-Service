const admin = require("firebase-admin");
const axios = require('axios');
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://asanget-b7de3-default-rtdb.firebaseio.com/"
});

const firebase = {};

firebase.
sendFireBaseMessage = (jsonObject, topic, title) => {
    const message = {
      "notification": {
        "title": title,
        "body": jsonObject.text,
        "image": "http://asanget.com/assets/Asanget%20Logo.jpg"
      },
      "token": topic,
    };
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  firebase.sendPushNotification = async () => {
    const FIREBASE_API_KEY = "AAAAbHBFVQw:APA91bGlLSQfLx-uBP7gRPZCLAmhIT27IlawPfxTSJhcdHQLFPLlmDZ6Nlk7ICKY90nJnRSut0HwDt0QLRWFgmKgm01VkSO9f3Q3u05ei2JurZtkw4mZOAmzTEMAj9jOfR5e1WhWPQ8U"
    const message = {
      registration_ids: [
        "eB_r1arXSl6DRpN02_xPjv:APA91bFoJa_ipVAYyvJ0M2VrY9DVDLCOWS1n5wDeapO3eenSIMgk7ZUQeU4ZlwMBZD3K_Qd94xPP63if07YUcRjeoNyvt_XEU0chrdfsKgtGTMaW57aPy4k5mlxAznAyvGMAljfH-ufR",
      ],
      notification: {
        title: "india vs south africa test",
        body: "IND chose to bat",
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: "high",
        content_available: true,
      },
      data: {
        title: "india vs south africa test",
        body: "IND chose to bat",
        score: 50,
        wicket: 1,
      },
    }
  
    // let headers = new Headers({
    //   "Content-Type": "application/json",
    //   Authorization: "key=" + FIREBASE_API_KEY,
    // })

    let response = await axios.create({
      baseURL: 'https://fcm.googleapis.com/fcm/send',
      timeout: 1000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "key=" + FIREBASE_API_KEY,
      },
      method:'post',
      data:JSON.stringify(message)
    });
  
    // let response = await fetch("https://fcm.googleapis.com/fcm/send", {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify(message),
    // })
    // response = await response.json()
    console.log('--------response--------', response);
  }
  
  module.exports = firebase;