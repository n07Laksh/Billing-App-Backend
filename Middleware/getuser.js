require("dotenv").config();

const jwt = require("jsonwebtoken");

const secret_Key = process.env.SECRET_KEY;

const getuser = (req, res, next) => {
  // Get user id from the jwt token and add it to req object
  const token = req.header("jwtoken");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid jwt token." });
  }

  try {
    // comparing the token with the Secret key
    const data = jwt.verify(token, secret_Key);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid jwt token." });
  }
};


module.exports = getuser;