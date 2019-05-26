const User = require('../models').User;
var bcrypt = require('bcrypt');
var config = require('../config/config.js');
var jwt = require('jsonwebtoken');

module.exports = {
  registerUser: function(req, res) {
      var hash = hashedPassword(req.body.password)
        return User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            dob: req.body.dob
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
  },

  authenticate: function(req, res) {
      User.findOne({where: {email: req.body.email} })
      .then(function(user){
          if (user && validatePassword(req.body.password, user.password)) {
            res.status(200).json({message: "Successful login!", token: generateToken(user)});
          } else{
            res.status(400).json({message: "Invalid username/password"});
          }
      })
      .catch(function(err){
          console.log("Something went wrong");
          res.status(400).send(err)
      })
  }
};

function hashedPassword(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }
  
function validatePassword(password, hashedPassword){
    return bcrypt.compareSync(password, hashedPassword);
}

function generateToken(user){
    var tokenConfig =  config.token;
    return jwt.sign({
      id: user.id
    },config["jwt-secret"], {expiresIn: tokenConfig.timeout*60});
  }
