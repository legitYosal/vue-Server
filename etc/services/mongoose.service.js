const mongoose = require('mongoose')
let count = 0

const options = {
    autoIndex: false,
    useUnifiedTopology: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect('mongodb://127.0.0.1:27017/Vue-Server', options).then(() => {
        console.log('MongoDB is successfully connected')
    }).catch(err => {
        console.log('MongoDB connection unbuild, retrying. ', ++count)
        setTimeout(connectWithRetry, 1000)
    })
}

connectWithRetry()

exports.mongoose = mongoose