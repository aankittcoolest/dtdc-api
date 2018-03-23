const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    street: { type: String},
    mainAddress : { type: String},
    landmark : { type: String},
    pincode: { type: String},
    district : { type: String},
    state : { type: String},
    country: { type: String, default: 'India'},
    createAt: {type: Date, default: new Date() }
})

module.exports = mongoose.model('Address', addressSchema)