const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoute.js');
const authRouter = require('./routes/authRoute.js')

dotenv.config()

const dns = require("dns");const e = require('express');
 dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err)
})

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)