const express = require('express')
var crypto = require('crypto');
const router = express.Router();


router.post('/generate_checksum',async(req,res) =>{

    var cryp = crypto.createHash('sha512')
    var text = req.body.key+'|'+req.body.txnid+'|'+req.body.amount+'|'+req.body.pinfo+'|'+req.body.fname+'|'+req.body.email+'|||||'+req.body.udf5+'||||||'+req.body.salt;
    cryp.update(text)
    var hash = cryp.digest('hex')
    res.setHeader("Content-Type", "text/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send({token: hash})


})

module.exports = router; 