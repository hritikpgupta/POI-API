const { Products, validate } = require('../models/product');
const express = require('express');
const auth = require('../middleware/authenticate')
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let product = new Products({
        uniqueID: req.body.uniqueID,
        productName: req.body.productName,
        variants: req.body.variants,
        description: req.body.description,
        generalUrl: req.body.generalUrl

    })
    product = await product.save()

    res.send(product)

})


router.get('/', async (req, res) => {

    const result = await Products.find()
    res.send(result)

})






module.exports = router; 