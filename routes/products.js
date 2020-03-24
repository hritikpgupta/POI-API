const { Products, validate } = require('../models/product');
const express = require('express');
const auth = require('../middleware/authenticate')
const router = express.Router();

router.post('/', auth, async (req, res) => {
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

    const result = await Products.find().sort({'_id': 0}).exec(function(err,data){
        if(err)
        res.send(err)

        res.send(data)
    })
    
})

router.get('/:uniqueID', auth, async(req,res) =>{
    let product = await Products.findOne({ uniqueID: req.params.uniqueID })
    if (!product) return res.status(400).send("Can't find product.")
    res.send(product)
})

router.put('/:uniqueID', auth, async (req, res) => {

    let product = await Products.findOne({ uniqueID: req.params.uniqueID })
    if (!product) return res.status(400).send("Can't find product.")
    product.variants = req.body.variants
    product = await product.save()
    res.send(product)

})

module.exports = router; 