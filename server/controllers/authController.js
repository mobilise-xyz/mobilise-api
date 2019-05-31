const userRepository = require('../repositories').UserRepository;
const volunteerRepository = require('../repositories').VolunteerRepository;
const adminRepository = require('../repositories').AdminRepository
var bcrypt = require('bcryptjs');
var config = require('../config/config.js');
var jwt = require('jsonwebtoken');

var AuthController = function(userRepository, volunteerRepository, adminRepository) {

  this.userRepository = userRepository;
  this.volunteerRepository = volunteerRepository;
  this.adminRepository = adminRepository;

  this.registerUser = function(req, res) {
    var hash = hashedPassword(req.body.password)

    userRepository
      .add(req.body, hash)
      .then(async(user) => {
          if (!user.admin) {
            await volunteerRepository.add({userId: user.id})
          } else {
            await adminRepository.add({userId: user.id})
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
      .catch(error => res.status(500).send(error));
  };

  this.loginUser = function(req, res) {

    userRepository
      .getByEmail(req.body.email)
      .then(user => {
        if (user && validatePassword(req.body.password, user.password)) {
          res.status(200).json({message: "Successful login!", uid: user.id, isAdmin: user.admin, token: generateToken(user)});
        } else{
          res.status(400).json({message: "Invalid username/password"});
        }
      })
      .catch(err => res.status(500).send(err))

  };
}

module.exports = new AuthController(userRepository, volunteerRepository, adminRepository);

/* Helper functions */
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
