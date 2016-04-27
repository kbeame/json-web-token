module.exports = exports = function(req, res, next) {
  var authHeader = req.headers.authorization;
  var namePassword = authHeader.split(' ')[1];
  var namePassBuf = new Buffer(namePassword, 'base64');
  var namePassPlainText = namePassBuf.toString();
  namePassBuf.fill();
  var namePassArr = namePassPlainText.split(':');
  req.auth = {
    username: namePassArr[0],
    password: namePassArr[1]
  };
  next();
};
