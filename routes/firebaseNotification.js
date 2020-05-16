const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/', (request,response) => {
  const obj = {
    notification: {title: request.body.title, body: request.body.msg},
    priority: "high",
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

module.exports = router; 