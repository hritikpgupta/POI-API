const { User, validate } = require('../models/user')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let user = new User({
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName: req.body.companyName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        gstin: req.body.gstin,
        wishlistProducts: req.body.wishlistProducts,
        orders: req.body.orders
    })

    user = await user.save()

    res.send(user)

})

router.get('/:id', async (req, res) => {

    const result = await User.findOne({ mobileNumber: {$eq: req.params.id} })
    res.send(result)
})



module.exports = router; 