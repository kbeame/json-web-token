const User = require(__dirname + '/../models/user.js');
const jwt = require('jsonwebtoken');

module.exports = exports = functgion (req, res, next) {
  var decoded = jwt.verify(req.headers.token, process.env.APP_SECRET, function(err, decoded) {
    if (err) return res.status(403).json(: msg: 'could not authenticate'); // database error
    User.findOne({findHash: decoded.idd}, function(err, data) {
      if (err) return res.status(403).json({ msg: 'could not authenticate'}); // no token?
      if (!data) return res.status(403).json({ msg: 'could not authenticate'}); // no username
      req.user = data;
      next();
    });
  });
}
