const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router();

router.post('/', async (req, res) => {

    let user = await User.findOne({ mobileNumber: req.body.mobileNumber })
    if (!user) return res.status(400).send({ error: 'Number is not registered.' })
    const salt = await bcrypt.genSalt(10)
    const result = await bcrypt.hash(req.body.password, salt)

    user.password = result
    await user.save()
    res.send({ success: 'Password Changed Successfully.' })

})
module.exports = router; 