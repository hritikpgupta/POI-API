const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt')
const express = require('express');
const jwt = require('jsonwebtoken')
const config = require('config')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10)
    const result = await bcrypt.hash(req.body.password, salt)

    const existingUser = await User.findOne({ mobileNumber: { $eq: req.body.mobileNumber } })
    if (existingUser) {
        res.status(400).send({ error: "Number already Registered." })
    } else {

        let user = new User({
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            companyName: req.body.companyName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            password: result,
            address: req.body.address,
            gstin: req.body.gstin,
            wishlistProducts: req.body.wishlistProducts,
            orders: req.body.orders
        })

        user = await user.save()

        const token = jwt.sign(
            {
                mobileNumber: req.body.mobileNumber,
                password: req.body.password
            },
            config.get('jwtPrivateKey'))

        res.header('x-auth-token', token).send(user)


    }

})

router.get('/:id', async (req, res) => {

    const result = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    res.send(result)
})



module.exports = router; 