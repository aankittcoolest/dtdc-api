const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

const SenderAddresses = require('../models/senderAddresses')
const Address = require('../models/address')

//Add new object for sender addresses
router.post('/', checkAuth, (req, res, next) => {
    userId = req.body.userId

    SenderAddresses.find({ userId: req.body.userId })
        .exec()
        .then(result => {
            if (result.length >= 1) {
                res.status(200).json({
                    message: 'user already exists'
                })
            } else {
                var addresses = new Array()
                if (req.body.address) {
                    const address = new Address({
                        _id: mongoose.Types.ObjectId(),
                        street: req.body.address.street,
                        mainAddress: req.body.address.mainAddress,
                        landmark: req.body.address.landmark,
                        pincode: req.body.address.pincode,
                        district: req.body.address.district,
                        state: req.body.address.state,
                        country: req.body.address.country
                    })
                    address.save()
                        .then(addressResult => {
                            var senderAddress = {}
                            senderAddress['serialNumber'] = 1
                            senderAddress['address'] = addressResult._id
                            addresses.push(senderAddress)
                            const senderAddresses = new SenderAddresses({
                                _id: mongoose.Types.ObjectId(),
                                userId: req.body.userId,
                                addresses: addresses
                            })
                            senderAddresses.save()
                                .then(result => {
                                    res.status(200).json({
                                        message: 'object successfully inserted',
                                        addressResult: addressResult,
                                        result: result
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: "invalid user id"
                                    })
                                })

                        })
                        .catch(err => {
                            return res.status(500).json({
                                error: "Unable to add new address"
                            })
                        })

                } else {
                    const senderAddresses = new SenderAddresses({
                        _id: mongoose.Types.ObjectId(),
                        userId: req.body.userId,
                        addresses: new Array()
                    })

                    senderAddresses.save()
                        .then(result => {
                            res.status(200).json({
                                message: 'object successfully inserted',
                                result: result
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: "invalid user id"
                            })
                        })
                }
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: "invalid user id or user not found"
            })
        })

})

//Add new object for inserting new addresses
router.patch('/add-address/:id', checkAuth, (req, res, next) => {
    SenderAddresses.find({ userId: req.body.userId })
        .exec()
        .then(result => {
            if (result) {
                var addresses = result[0].addresses
                const address = new Address({
                    _id: mongoose.Types.ObjectId(),
                    street: req.body.address.street,
                    mainAddress: req.body.address.mainAddress,
                    landmark: req.body.address.landmark,
                    pincode: req.body.address.pincode,
                    district: req.body.address.district,
                    state: req.body.address.state,
                    country: req.body.address.country
                })
                address.save()
                    .then(addressResult => {
                        var senderAddress = {}
                        senderAddress['serialNumber'] = addresses.length + 1
                        senderAddress['address'] = addressResult._id
                        addresses.push(senderAddress)
                        var updateOps = {}
                        updateOps["addresses"] = addresses
                        console.log(updateOps)
                        SenderAddresses.update({ _id: req.params.id }, { $set: updateOps })
                            .exec()
                            .then(result => {
                                console.log(result)
                                return res.status(200).json({
                                    message: 'New address successfully inserted',
                                    addressResult: addressResult,
                                    result: result
                                })
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
                                })
                            })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            error: err
                        })
                    })
            } else {
                return res.status(404).json({
                    message: "user not found"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: "user not found"
            })
        })

})

//Temporary route to get address list
router.get('/addresses', checkAuth, (req, res, next) => {
    Address.find()
        .exec()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

//Temporary route to delete all addresses
router.delete('/addresses', checkAuth, (req, res, next) => {
    Address.remove({})
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

//Temporary route to get all senders addresses of all users
router.get('/all', checkAuth, (req, res, next) => {
    SenderAddresses.find()
        .exec()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

//Temporary route to delete all senders addresses of all users
router.delete('/', (req, res, next) => {
    SenderAddresses.remove({})
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})


router.get('/:userId',  (req, res, next) => {
    SenderAddresses.find({ userId: req.params.userId })
        .populate('addresses.address')
        .exec()
        .then(result => {
            res.status(200).json({
                result: result[0]
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

module.exports = router
