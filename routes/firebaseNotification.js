const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const https = require('https');
var serviceAccount = require("../key/privateKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dpsadmin-339a7.firebaseio.com"
});
let db = admin.firestore();



router.post('/', (request,response) => {
  const obj = {
    notification: {title: request.body.title, body: request.body.msg},
    priority: "high",
    icon:"myicon",
    registration_ids: request.body.registration_ids,
  }
    const options = {
        hostname: 'fcm.googleapis.com',
        port: 443,
        path: '/fcm/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'key='+ request.body.serverKey
        },
    }
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
         res.on('data', d => {
          process.stdout.write(d)
          response.status(200).send({success: "Sent"})
        })
      })
      req.on('error', error => {
        console.error(error)
      })
      req.write(JSON.stringify(obj))
      req.end()

})



router.post('/add', async (req,res) => {

  let docRef = db.collection('node').doc('class');

  let setAda = {
    first: req.body.first,
    last: req.body.last,
    born: req.body.born
  }
  await docRef.set(setAda);

  res.send({ success : setAda})




})

module.exports = router; 