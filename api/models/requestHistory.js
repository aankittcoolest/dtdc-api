const mongoose = require('mongoose')

const requestHistorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    receiverAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    date: { type: String },
    time: { type: String },
    createdAt: {type: Date, default: new Date }
})

module.exports = mongoose.model('RequestHistory', requestHistorySchema)