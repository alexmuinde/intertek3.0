/**const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    pin: {type: String, required: true}
}, {timestamp: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: {
			type: String,
			default:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF02Jj8T2t7PdkytAw42HDuuSz7yXguKn8Lg&s",
		},
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

// This must match the 'const User = require(...)' in your controller
module.exports = User;
