const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./models/user');

const apiRoutes = express.Router();

var port = process.env.PORT || 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello! The api is at http://localhost:' + port + '/api');
});

app.get('/setup', (req, res) => {
  var kat = new User({
    name: 'Kat Beame',
    password: 'password',
    admin: 'true'
  });
  kat.save((err) => {
    if (err) throw err;
    console.log('User saved sucessfully');
    res.json({ sucess: true });
  });
});


apiRoutes.post('/authenticate', (req, res) => {
  User.findOne({
    name: req.body.name
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, msg: 'Authentication failed. User not found.' });
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, msg: 'Authentication failed. Wrong password.' });
      } else {

        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440
        });
        res.json({
          success: true,
          msg: 'Enjoy your token',
          token: token
        });
      }
    }
  });
});


apiRoutes.use((req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to authenticate token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      msg: 'No token provided'
    });
  }
});

apiRoutes.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the coolest API on earth!'});
});

apiRoutes.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});
app.use('/api', apiRoutes);






app.listen(port);
console.log('Magic happend at http://localhost:' + port + '/api')
