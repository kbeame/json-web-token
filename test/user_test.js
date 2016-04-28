const expect = require('chai').expect;
const User = require(__dirname + '/../models/user.js');
const mongoose = require('mongoose');

describe('random user find hash' , function () {
  before (function(done) {
    mongoose.connect('mongodb://localhost/rand_user_hash_test');
    var newUser = new User({ username: ' test', password: 'test'});
    newUser.save(function(err, data) {
      this.user = data;
      done();
    });
  });
  after (function(done) {
    this.user.remove(done);
  });

  it('should be able to create a random hash', (done) => {
    this.user.generateFindHash((err, hash) => {
      expect(hash.length).to.not.eql(null);
        expect(err).to.eql(null);
        expect(hash).to.eql(this.user.findHash);
        done();
    });
  });
});
