const Joi = require('joi')
const mongoose = require('mongoose')


const wishListSchema = mongoose.Schema({
    uniqueID: { type: String, required: true },
    productName: { type: String, require: true },
    generalUrl: { type: String, required: true }
})

const cartSchema = mongoose.Schema({
    uniqueID: { type: String, required: true },
    productName: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    url: { type: String, required: true },
    amount: {type:Number, required:true},
    perCarton: { type: Number, required: true }

})



const item = mongoose.Schema({
    productName: { type: String, require: true },
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
    url: { type: String, require: true },
    amount: { type: Number, require: true }
})

const ordersSchema = mongoose.Schema({
    
    orderID: { type: String, required: true },
    refNo: {type:String, required: true},
    txnId: {type:String, required: true},
    orderDate: {type: String,required: true},
    totalAmount: { type: Number, required: true },
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    paymentMode: { type: String, required: true },
    items: [item]
})

const User = mongoose.model('Users', new mongoose.Schema({
    // id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    profileImage: { type: String },
    companyName: { type: String, required: true },
    mobileNumber: { type: Number, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    address: { type: String, required: true },
    gstin: { type: String, required: true },
    wishlistProducts: [wishListSchema],
    orders: [ordersSchema],
    cartItems:[cartSchema]

}))

function validateUser(user) {
    const schema = {
        // id: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().allow('').optional(),
        profileImage: Joi.string().allow('').optional(),
        companyName: Joi.string().required(),
        mobileNumber: Joi.number().required(),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
        address: Joi.string().required(),
        gstin: Joi.string().required(),
        wishlistProducts: Joi.array().min(0),
        orders: Joi.array().min(0),
         cartItems:Joi.array().min(0)

    }

    return Joi.validate(user, schema)
}

exports.validate = validateUser;
exports.User = User;

