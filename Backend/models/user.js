// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  aadhar: { type: String, required: true },
  dob: { type: Date, required: true },
}); 


module.exports = mongoose.model('User', userSchema);
