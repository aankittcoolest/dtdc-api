const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
require('dotenv').config()


const User = require('../models/user')

router.get('/all', (req, res, next) => {
    User.find()
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.get('/', checkAuth, (req, res, next) => {
    if(req.userData) {
        return res.status(200).json({
            found: 1,
            user: req.userData
        })
    } else {
        return res.status(200).json({
            found: 0
        })
    }
})

router.post('/signup', (req, res, next) => {
    console.log(req.body)
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'User already exists'
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        phone: req.body.phone
                    })

                    user.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'User successfully created'
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })

        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }

                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                } )
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                })

            })

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})



module.exports = router