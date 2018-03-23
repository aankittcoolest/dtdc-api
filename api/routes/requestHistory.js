const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

const RequestHistory = require('../models/requestHistory')

router.post('/', checkAuth, (req, res, next) => {
    var requestHistory = new RequestHistory({
        _id: mongoose.Types.ObjectId(),
        userId: req.body.userId,
        senderAddress: req.body.senderAddress,
        receiverAddress: req.body.receiverAddress,
        date: req.body.date,
        time: req.body.time
    })

    requestHistory.save()
    .then(result => {
        res.status(201).json({
            message: 'request has been successfully saved',
            result: result
        })
    })
    .catch(err => {
        return res.status(200).json({
            error: err
        })
    })
})

router.get('/:userId', checkAuth, (req, res, next) => {
    RequestHistory.find({ userId: req.params.userId})
    .populate('senderAddress')
    .populate('receiverAddress')
    .exec()
    .then(result => {
        res.status(200).json({
            result: result
        })
    })
    .catch(err => {
        return res.status(200).json({
            error: err
        })
    })

})

module.exports = router