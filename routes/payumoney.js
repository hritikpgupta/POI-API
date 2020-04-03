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

router.post('verify_transaction',async(req,res) => {
    var key = req.body.key;
	var salt = req.body.salt;
	var txnid = req.body.txnid;
	var amount = req.body.amount;
	var productinfo = req.body.productinfo;
	var firstname = req.body.firstname;
	var email = req.body.email;
	var udf5 = req.body.udf5;
	var mihpayid = req.body.mihpayid;
	var status = req.body.status;
	var resphash = req.body.hash;
	
	var keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
	var keyArray 		= 	keyString.split('|');
	var reverseKeyArray	= 	keyArray.reverse();
	var reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');
	
	var cryp = crypto.createHash('sha512');	
	cryp.update(reverseKeyString);
	var calchash = cryp.digest('hex');
	
	var msg = 'false';
	if(calchash == resphash)
        msg = 'true';
        
    res.send({msg:msg})    

})




module.exports = router; 