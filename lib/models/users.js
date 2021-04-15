const mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    OTP: { type: String, required: true },
    created: { type: Date, default: Date.now }
});



module.exports = mongoose.model('users', userSchema);