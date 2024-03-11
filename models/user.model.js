const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  fingerPrint: {
    type: String,
    requred: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
