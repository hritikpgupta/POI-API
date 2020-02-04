const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const _ = require('lodash')
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ mobileNumber: req.body.mobileNumber })

    if (!user) return res.status(400).send('No account registered with this number .')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
        
    if(validPassword){
        res.send(user)
    }else{
        res.status(400).send('Wrong Password.')
    }

})

function validate(auth) {
    const schema = {
        mobileNumber: Joi.number().required(),
        password: Joi.string().required()
    }

    return Joi.validate(auth, schema);
}

module.exports = router; 