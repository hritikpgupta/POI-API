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
           // id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            profileImage: "",
            companyName: req.body.companyName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            password: result,
            address: req.body.address,
            gstin: req.body.gstin,
            wishlistProducts: req.body.wishlistProducts,
            orders: req.body.orders,
            cartItems:req.body.cartItems
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

router.get('/:id', auth,async (req, res) => {

    const result = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!result) return res.status(400).send({error: 'Number not registered.'})

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
    res.send({ orders: result.orders })
})

router.get('/wishlist/:id', auth, async (req, res) => {

    const result = await User.findOne({ mobileNumber: { $eq: req.params.id } }).select({ wishlistProducts: 1 })
    if (!result) return res.status(400).send({ error: "Not Found" })
    res.send({ wishlistProducts: result.wishlistProducts })
})

router.put('/addToWishlist/:id', auth, async (req, res) => {
    const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!user) return res.status(400).send({ error: "Not Found" })
    let wishlist = {
        uniqueID: req.body.uniqueID,
        productName: req.body.productName,
        generalUrl: req.body.generalUrl
    }
    let check = false
    var w 
    let mywishList = []
    mywishList = user.wishlistProducts
    if(mywishList.length === 0){
        mywishList.push(wishlist)
    }else{
        for( w of mywishList){
            if(w.uniqueID === wishlist.uniqueID){
                check = true
            }
        }
        if(check === false){
            mywishList.push(wishlist)
        }
    }
    user.wishlistProducts = mywishList
    wishlist = await user.save()
    res.send({ success: "Updated" })
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
        items: req.body.items,
        orderID: req.body.orderID,
        refNo:req.body.refNo,
        txnId:req.body.txnId,
        orderDate:req.body.orderDate,
        totalAmount: req.body.totalAmount,
        companyName: req.body.companyName,
        address: req.body.address,
        paymentMode: req.body.paymentMode
    }
    let myOrders = []
    myOrders = user.orders
    myOrders.push(order)
    user.orders = myOrders
    order = await user.save()
    res.send({ success: "Updated" })

})


router.post('/addToCart/:id',auth,async(req,res) => {
    const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!user) return res.status(400).send({ error: "Not Found" })
    let cart = {
        uniqueID: req.body.uniqueID,
        productName: req.body.productName,
        size: req.body.size,
        quantity:req.body.quantity,
        url:req.body.url,
        amount: req.body.amount,
        perCarton:req.body.perCarton
    }
    let check = false
    var w 
    let myCartList = []
    myCartList = user.cartItems
    if(myCartList.length === 0){
        myCartList.push(cart)
    }else{
        for( w of myCartList){
            if(w.size.match(cart.size) ){
                if(w.uniqueID.match(cart.uniqueID)){
                    check = true
                    return res.status(409).send({success: "Success Idempotent"})
                }

            }
        }
        if(check === false){
            myCartList.push(cart)
        }
    }
    user.cartItems = myCartList
    cart = await user.save()
    res.send({ success: "added" })
})

router.delete('/deleteCartItem/:id/:size/:uniqueID',auth, async(req,res) => {
    let myCartList = []
    const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
      if (!user) return res.status(400).send({ error: "Not Found" })
    myCartList = user.cartItems
    console.log(req.params.size)
    for (var i = 0; i < myCartList.length; i++) {
        console.log(myCartList[i].size)
        if (req.params.size.match(myCartList[i].size) && req.params.uniqueID.match(myCartList[i].uniqueID)) {
            console.log("Here...")
            myCartList.splice(i, 1)
            console.log(myCartList[1])
            user.cartItems = myCartList
            await user.save()
            return res.send(myCartList)
        }
    }
    res.status(400).send({ error: "Size is wrong.." })
})

router.get('/getAllCart/:id',auth, async(req,res) =>{
    const result = await User.findOne({ mobileNumber: { $eq: req.params.id } })
    if (!result) return res.status(400).send({error: 'Number not registered.'})

    res.send(result.cartItems)
})




router.put('/updateCart/:id',auth, async(req,res) =>{
    let myCartList = []
    const object = {
        size: req.body.size,
        uniqueID:req.body.uniqueID,
        quantity:req.body.quantity,
        amount:req.body.amount
    }
   const user = await User.findOne({ mobileNumber: { $eq: req.params.id } })
   if (!user) return res.status(400).send({ error: "Not Found" })
    console.log(user)
    myCartList = user.cartItems
    console.log(myCartList)
    for (var i = 0; i < myCartList.length; i++) {
        if (req.body.size === (myCartList[i].size) && req.body.uniqueID.match(myCartList[i].uniqueID)) {
            var item = myCartList[i]
            item.quantity = object.quantity
            item.amount = object.amount
            myCartList[i] = item
            user.cartItems = myCartList
            await user.save()
            return res.send({success: "Updated"})
        }
    }
    res.send({ success: "Not Found" })
})

module.exports = router; 