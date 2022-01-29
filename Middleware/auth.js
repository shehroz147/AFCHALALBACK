const jwt = require("jsonwebtoken");

const config = process.env;

module.exports = (req, res, next)=> {
  try{
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
}
catch(error){
  return res(400).json("invalid");
  }
};
