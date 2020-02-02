const Joi = require('joi')
const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true }
});

const Variant = mongoose.model('Author', variantSchema);
const Products = mongoose.model('Products', new mongoose.Schema({

    uniqueID: { type: String, required: true },
    productName: { type: String, required: true },
    variants: [variantSchema],
    description: { type: String, required: true, minlength: 15 },
    generalUrl: { type: String, required: true }
}))

function validateProducts(product) {
    const schema = {
        uniqueID: Joi.string().required(),
        productName: Joi.string().required(),
        variants: Joi.array().required(),
        description: Joi.string().required(),
        generalUrl: Joi.string().required()
    }

    return Joi.validate(product, schema);
}

exports.Products = Products;
exports.Variant = Variant;
exports.validate = validateProducts;