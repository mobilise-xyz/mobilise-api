const userRepository = require('../repositories/userRepository');
const volunteerRepository = require('../repositories/volunteerRepository');
var bcrypt = require('bcryptjs');
var config = require('../config/config.js');
var jwt = require('jsonwebtoken');

module.exports = {
  registerUser: function(req, res) {
      var hash = hashedPassword(req.body.password)
      userRepository.add(req.body, hash)
      .then(user => {
          if (!user.admin) {
            volunteerRepository.add({userId: user.id})
          } else {
            // Admin table
          }
          return user
      })
      .then(user => res.status(201).send(
          {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              admin: user.admin,
              dob: user.dob
          }
      ))
      .catch(error => res.status(400).send(error));
  },

  loginUser: function(req, res) {
      userRepository.getByEmail(req.body.email)
      .then(user => {
        if (user && validatePassword(req.body.password, user.password)) {
          res.status(200).json({message: "Successful login!", token: generateToken(user)});
        } else{
          res.status(400).json({message: "Invalid username/password"});
        }
      })
      .catch(err => {
          res.status(400).send(err);
      })
  },
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
