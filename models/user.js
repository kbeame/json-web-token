const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema({
  name: {type: String, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});

userSchema.methods.gererateHash = function(password) {
  this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateFindHash = function(cb) {
  var tries = 0;
  var timeout;
  var _generateFindHash = () => {
    var hash = crypto.randomBytes(32);
    this.findHash = hash;
    this.save((err, data) => {
      if (err) {
        if (tries > 9) {
          return cb(new Error('could not generate hash'));
        }
        return timeout = setTimeout(function () {
          _generateFindHash();
          tries++;
        }, 1000);
      }
      if (timeout) {
        clearTimeout(timeout);

        cb(null, hash.toString('hex'));
      }
    });
  };
};
userSchema.methods.generateToken = function(cb) {
  this.generateFindHash(function(err, hash) {
    if (err) return cb(err);
    cb(null, jwt.sign({idd: hash}, process.env.APP_SECRET));
  });
};
module.exports = exports = mongoose.model('User', userSchema);
