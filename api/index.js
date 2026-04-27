const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoute.js');

dotenv.config()

const dns = require("dns"); dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err)
})

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!')
})

app.use('/api/user', userRouter)