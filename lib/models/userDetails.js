const mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    role: { type: String, required: true, max: 10 },
    status: { type: String, required: false },
    created: { type: Date, default: Date.now }
});



module.exports = mongoose.model('userDetails', userSchema);