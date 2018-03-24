const epxress = require('express')
const app = epxress()
const morgan = require('morgan')
const mongooose = require('mongoose')
const bodyParser = require('body-parser')

const userRouters = require('./api/routes/user')
const senderAddressesRouters = require('./api/routes/senderAddresses')
const receiverAddressesRouters = require('./api/routes/receiverAddresses')
const requestHistoryRouters = require('./api/routes/requestHistory')


mongooose.connect('mongodb://dtdc:dtdc@cluster0-shard-00-00-61tgy.mongodb.net:27017,cluster0-shard-00-01-61tgy.mongodb.net:27017,cluster0-shard-00-02-61tgy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')

mongooose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})

app.use('/user', userRouters)
app.use('/sender-addresses', senderAddressesRouters)
app.use('/receiver-addresses', receiverAddressesRouters)
app.use('/request-history', requestHistoryRouters)

app.use((req, res, next) => {
    const error = new Error('Not  Found')
    error.status = 404
    next(error)
})


app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app

