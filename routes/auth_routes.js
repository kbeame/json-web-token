const express = require('express');
const User = require(__dirname + '/../model/user');
const jsonParser = require('body-parser').json();
const basicHttp = require(__dirname + '/../lib/basic_http');

var router = module.exports = exports = express.Router();

router.post('/sign_up', jsonParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;
  if (!password) return res.stataus(500).json({ msg: 'no blank passwords' });
  var newUser = new User(req.body);
  newUser.generateHash(password);
  password = null;
  newUser.save((err, data) => {
    if (err) return res.status(500).json({msg: 'could not create user'});
    // TODO (xxx) send a jwt on a successful user creation
    res.json({msg: 'user created!'});
  });
});

router.get('/signin', basicHttp, (req, res) => {
  User.findOne({ username: req.auth.username}, (err, user) => {
    if (err) res.status(500).json({ msg: 'could not authenticate' });
    if (!user) return res.status(500).json({ msg: 'could not authenticate'});
    if (!user.compareHash(req.auth.password)) return res.status(500).json({ msg: 'could not authenticate'});
    res.json({ msg: 'authenticate says yes' });
  });
});
