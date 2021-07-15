const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<firebasenotification>.firebaseio.com"
});

const firebase = {};

firebase.sendFireBaseMessage = (jsonObject, topic, title) => {
    const message = {
      "notification": {
        "title": title,
        "body": jsonObject.text,
        "image": "http://<domainname>/favicon.ico"
      },
      topic: topic
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
  
  module.exports = firebase;