const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  name: {type: String, unique: true},
  password: {type: String, required: true}
});

userSchema.methods.gererateHash = function(password) {
  this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = exports = mongoose.model('User', userSchema);
