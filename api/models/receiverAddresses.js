
const mongoose = require('mongoose')

const receiverAddresses = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    addresses: [{
        serialNumber: Number,
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    }]
})

module.exports = mongoose.model('Receiver', receiverAddresses)