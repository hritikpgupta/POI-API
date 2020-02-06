const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt')
const express = require('express');
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authenticate')
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

router.put('/:id', auth, async (req, res) => {
    let user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!user) return res.status(400).send('Number not registered.')

    user.set({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName: req.body.companyName,
        email: req.body.email,
        address: req.body.address,
        gstin: req.body.gstin,

    })

    await user.save()
    res.send({ success: "Updated" })
})

router.get('/orders/:id', auth, async (req, res) => {

    const result = await User.findOne({ mobileNumber: { $eq: req.params.id } }).select({ orders: 1 })
    if (!result) return res.status(400).send({ error: "Not Found" })
    res.send(result)
})

router.get('/wishlist/:id', auth, async (req, res) => {

    const result = await User.findOne({ mobileNumber: { $eq: req.params.id } }).select({ wishlistProducts: 1 })
    if (!result) return res.status(400).send({ error: "Not Found" })
    res.send(result)
})

router.put('/addToWishlist/:id', auth, async (req, res) => {
    const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!user) return res.status(400).send({ error: "Not Found" })
    let wishlist = {
        uniqueID: req.body.uniqueID,
        productName: req.body.productName,
        generalUrl: req.body.generalUrl
    }
    let mywishList = []
    mywishList = user.wishlistProducts
    mywishList.push(wishlist)
    user.wishlistProducts = mywishList
    wishlist = await user.save()
    res.send(wishlist)
})

router.delete('/deleteWishListProduct/:id/:uniqueID', auth, async (req, res) => {

    let mywishList = []
    const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
        .select({ wishlistProducts: 1 })
    if (!user) return res.status(400).send({ error: "Not Found" })
    mywishList = user.wishlistProducts

    for (var i = 0; i < mywishList.length; i++) {

        if (req.params.uniqueID === mywishList[i].uniqueID) {

            mywishList.splice(i, 1)
            user.wishlistProducts = mywishList
            await user.save()
            return res.send({ status: 'Deleted Successfully' })
        }
    }
    res.status(400).send({ error: "Unique ID is wrong.." })
})

router.put('/addOrder/:id', auth, async (req, res) => {

    const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!user) return res.status(400).send({ error: "Not Found" })
    let order = {
        orderID: req.body.orderID,
        totalAmount: req.body.totalAmount,
        companyName: req.body.companyName,
        address: req.body.address,
        items: req.body.items,
        paymentMode: req.body.paymentMode
    }
    let myOrders = []
    myOrders = user.orders
    myOrders.push(order)
    user.orders = myOrders
    order = await user.save()
    res.send(order)

})

module.exports = router; 