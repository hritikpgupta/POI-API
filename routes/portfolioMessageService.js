const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
var serviceAccount = require("../key/firebaseKeyPortfolio.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://portfolio-messageservice.firebaseio.com"
  });
const db = admin.firestore();


router.post('/', async(req,res) => {

    var docRef = db.collection('mails').doc(req.body.email);
      docRef.set({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
  
    res.send({ success : "Done"})
})


module.exports = router; 