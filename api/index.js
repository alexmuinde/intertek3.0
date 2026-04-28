const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoute.js');
const authRouter = require('./routes/authRoute.js')

dotenv.config()

const dns = require("dns");const e = require('express');
 dns.setServers(["1.1.1.1", "8.8.8.8"]);

/**mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err)
}) */

mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.error('DATABASE CONNECTION ERROR:', err.message); // This will show you WHY it's failing
  });

// Add this to listen for errors that happen AFTER the initial connection
mongoose.connection.on('error', err => {
  console.error('Mongoose secondary connection error:', err);
});


const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

//create a middleware to catch errors
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false, statusCode, message
    })
})