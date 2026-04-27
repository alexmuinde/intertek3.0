const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    pin: {type: String, required: true, minlength: 4, maxlength: 5, match: /^[0-9]+$/}
}, {timestamp: true});

const User = mongoose.model('User', userSchema);

export default User;