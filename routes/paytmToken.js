const express = require('express')
const router = express.Router();
const paytm_checksum = require('../paytm/checksum')
const https = require('https');



router.post('/verify',async(req,res) =>{
    var paytmParams = {};
    paytmParams.body = {
    "requestType" : req.body.requestType,
    "mid" : req.body.mid,
    "orderId" : req.body.orderId,
    "websiteName" : req.body.websiteName,
    "txnAmount" : {
        "value" : req.body.value,
        "currency" : req.body.currency,
    },
    "userInfo" : {
        "custId" : req.body.custId,
    },
    "callbackUrl" : req.body.callbackUrl,


};

var isValidChecksum = paytm_checksum.verifychecksumbystring(JSON.stringify(paytmParams.body), "WQRO1cyw78DjdXKi", req.body.checksum)
if(isValidChecksum) {
    console.log("Checksum Matched");
    res.send("Matched")
} else {
    console.log("Checksum Mismatched");
    res.send("Mismatched")
}

})

router.post('/generate_checksum', async (req, res) => {
    var paytmParams = {};
    paytmParams.body = {
        "requestType" : req.body.requestType,
        "mid" : req.body.mid,
        "orderId" : req.body.orderId,
        "websiteName" : req.body.websiteName,
        "txnAmount" : {
            "value" : req.body.value,
            "currency" : req.body.currency,
        },
        "userInfo" : {
            "custId" : req.body.custId,
        },
        "callbackUrl" : req.body.callbackUrl,
    
    };
    paytm_checksum.genchecksumbystring(JSON.stringify(paytmParams.body),'WQRO1cyw78DjdXKi', function(err,checksum){
    res.send({token: checksum})
    } )
    
})


router.post('/transaction', async(req,res) =>{
    var paytmParams = {};
    paytmParams.body = {
    "requestType" : req.body.requestType,
    "mid" : req.body.mid,
    "orderId" : req.body.orderId,
    "websiteName" : req.body.websiteName,
    "txnAmount" : {
        "value" : req.body.value,
        "currency" : req.body.currency,
    },
    "userInfo" : {
        "custId" : req.body.custId,
    },
    "callbackUrl" : req.body.callbackUrl,
};
paytmParams.head = {
    "signature"	: req.body.checksum
};

var post_data = JSON.stringify(paytmParams);
var mid = req.body.mid
var oid = req.body.orderId
var link = "/theia/api/v1/initiateTransaction?mid="+mid+"&orderId="+oid
var options = {
    hostname: 'securegw-stage.paytm.in',
    port: 443,
    path: link,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': post_data.length
    }
};
var response = "";
var post_req = https.request(options, function(post_res) {
    post_res.on('data', function (chunk) {
        response += chunk;
    });

    post_res.on('end', function(){
        console.log('Response: ', response);
        res.send(JSON.parse(response))
    });
});
post_req.write(post_data);
post_req.end();

})



module.exports = router; 

