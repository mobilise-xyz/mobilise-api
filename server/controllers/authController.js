const userContactPreferenceRepository = require("../repositories")
  .UserContactPreferenceRepository;
const userRepository = require("../repositories").UserRepository;
const volunteerRepository = require("../repositories").VolunteerRepository;
const adminRepository = require("../repositories").AdminRepository;
const moment = require("moment");
const bcrypt = require("bcryptjs");
const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const { PhoneNumberFormat, PhoneNumberUtil } = require('google-libphonenumber');
const phoneUtil = PhoneNumberUtil.getInstance();

var AuthController = function(
  userRepository,
  volunteerRepository,
  adminRepository
) {
  this.registerUser = function(req, res) {
    userRepository
      .getByEmail(req.body.email)
      .then(user => {
        if (user) {
          res
            .status(400)
            .send({ message: "An account with that email already exists" });
        } else {
          var hash = hashedPassword(req.body.password);
          const number = phoneUtil.parse(req.body.telephone, 'GB');
          if (!phoneUtil.isValidNumber(number)) {
            res
              .status(400)
              .send({ message: "Invalid UK phone number" });
          } else {
            const formattedNumber = phoneUtil.format(number, PhoneNumberFormat.E164);
            return userRepository.add(req.body, hash, formattedNumber);
          }
        }
      })
      .then(async user => {
        // Add user to volunteer or admin table
        if (!user.isAdmin) {
          await volunteerRepository.add({ userId: user.id });
        } else {
          await adminRepository.add({ userId: user.id });
        }

        return user;
      })
      .then(async user => {
        // Create entry for user's contact preferences
        await userContactPreferenceRepository.add(user.id, {
          email: false,
          text: false
        });
        return user;
      })
      .then(user =>
        res.status(201).send({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          dob: user.dob
        })
      )
      .catch(error => res.status(500).send(error));
  };

  this.loginUser = function(req, res) {
    var lastLogin;
    var loggedInUser;
    userRepository
      .getByEmail(req.body.email)
      .then(user => {
        loggedInUser = user;
        if (user && validatePassword(req.body.password, user.password)) {
          return user;
        } else {
          res.status(400).json({ message: "Invalid username/password" });
        }
      })
      .then(user => {
        lastLogin = user.lastLogin;
        const currentDate = moment();
        return userRepository.update(user, {
          lastLogin: currentDate
        });
      })
      .then(() => {
        res.status(200).json({
          message: "Successful login!",
          uid: loggedInUser.id,
          isAdmin: loggedInUser.isAdmin,
          lastLogin: lastLogin,
          token: generateToken(loggedInUser)
        });
      })
      .catch(err => res.status(500).send(err));
  };
};

module.exports = new AuthController(
  userRepository,
  volunteerRepository,
  adminRepository
);

/* Helper functions */
function hashedPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function generateToken(user) {
  var tokenConfig = config.token;
  return jwt.sign(
    {
      id: user.id
    },
    config["jwt-secret"],
    { expiresIn: tokenConfig.timeout * 60 }
  );
}
