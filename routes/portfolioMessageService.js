const express = require('express');
const admin2 = require('firebase-admin');
router = express.Router();
var serviceAccount2 = require("../key/firebaseKeyPortfolio.json");
admin2.initializeApp({
    credential: admin2.credential.cert(serviceAccount2),
    databaseURL: "https://portfolio-messageservice.firebaseio.com"
  });
const db = admin2.firestore();


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