const userContactPreferenceRepository = require("../repositories")
  .UserContactPreferenceRepository;
const userRepository = require("../repositories").UserRepository;
const volunteerRepository = require("../repositories").VolunteerRepository;
const adminRepository = require("../repositories").AdminRepository;
const moment = require("moment");
const config = require("../config/config.js");
const {errorMessage} = require("../utils/error");
const jwt = require("jsonwebtoken");
const invitationTokenRepository = require("../repositories").InvitationTokenRepository;
const forgotPasswordTokenRepository = require("../repositories").ForgotPasswordTokenRepository;
const {EmailClient, emailClientTypes} = require("../utils/email");
const {isSecure, hashedPassword, validatePassword} = require("../utils/password");
const {PhoneNumberFormat: PNF, PhoneNumberUtil} = require('google-libphonenumber');
const crypto = require("crypto");
const {body, validationResult} = require('express-validator');
const phoneUtil = PhoneNumberUtil.getInstance();

let AuthController = function (
  userRepository,
  volunteerRepository,
  adminRepository,
  invitationTokenRepository,
  forgotPasswordTokenRepository
) {

  this.registerUser = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array()
      });
    }
    // Check they have provided a valid invitation token
    let invitation;
    try {
      invitation = await invitationTokenRepository.getByToken(req.body.token);
    } catch (e) {
      return res.status(500).json(errorMessage(e));
    }
    if (!invitation) {
      return res.status(400).json({message: "Invalid token"});
    }
    if (invitation.email !== req.body.email) {
      return res.status(400).json({message: "Please use the email that received the invitation."});
    }
    if (moment().isAfter(invitation.expiry)) {
      return res.status(400).json({
        message: "Token has expired. " +
          "Please request another invite from an admin."
      });
    }
    // Check there does not exist a user already
    let existingUser;

    // Check the provided values are valid
    try {
      existingUser = await userRepository.getByEmail(req.body.email);
    } catch (err) {
      return res.status(500).json(errorMessage(err));
    }
    if (existingUser) {
      return res.status(400).json({message: "An account with that email already exists"});
    }

    // Check password
    if (!isSecure(req.body.password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, contain at least one uppercase letter, " +
          "one lowercase letter and one number/special character"
      });
    }

    // Check phone number
    const number = phoneUtil.parse(req.body.telephone, 'GB');
    if (!phoneUtil.isValidNumber(number)) {
      return res
        .status(400)
        .json({message: "Invalid UK phone number"});
    }

    // Create the account

    const hash = hashedPassword(req.body.password);
    const formattedNumber = phoneUtil.format(number, PNF.E164);
    invitationTokenRepository.removeByToken(req.body.token)
      .then(() => userRepository.add(req.body, hash, formattedNumber, invitation.isAdmin))
      .then(user => {
        // Add user to volunteer or admin table
        if (!user.isAdmin) {
          return volunteerRepository.add({userId: user.id}).then(() => user);
        } else {
          return adminRepository.add({userId: user.id}).then(() => user);
        }
      })
      .then(user => {
        // Create entry for user's contact preferences
        return userContactPreferenceRepository.add(user.id, {
          email: false,
          text: false
        }).then(() => user);
      })
      .then(user =>
        res.status(201).json({
          message: "Successful! User created",
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
          }
        })
      )
      .catch(error => res.status(500).json({message: errorMessage(error)}));
  };

  this.inviteAdmin = async function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array()
      });
    }
    // Check request has the correct key
    if (req.body.adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({message: "Not authenticated"});
    }

    // Check the user does not already have an account
    let existingUser;
    try {
      existingUser = await userRepository.getByEmail(req.body.email);
    } catch (err) {
      return res.status(500).json(errorMessage(err));
    }
    if (existingUser) {
      return res.status(400).json({message: "User already has an account"});
    }

    // Check there is not already a valid invitation for user
    let existingInvitation;
    try {
      existingInvitation = await invitationTokenRepository.getByEmail(req.body.email);
    } catch (err) {
      return res.status(500).json(errorMessage(err));
    }
    if (existingInvitation && moment().isBefore(existingInvitation.expires)) {
      return res.status(400).json({message: "User with that email has already been invited!"});
    }

    // Create new invitation and send it
    const token = crypto.randomBytes(16).toString('hex');
    const expires = moment().add(1, 'days').format();
    return invitationTokenRepository.add(req.body.email, token, expires, true)
      .then(() => {
        const emailClient = new EmailClient(emailClientTypes.NOREPLY);
        return emailClient.send(req.body.email,
          "Invitation to City Harvest",
          `Hello from Mobilise,
You have been invited to join City Harvest's Mobilise application.
Please click the following link to begin creating your account on Mobilise.

${process.env.WEB_URL}/signup?token=${token}

This link will expire in 24 hours.`)
      })
      .then(() => res.status(200).json({message: "Success! Invitation has been sent."}))
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.loginUser = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array()
      });
    }
    // Check the credentials
    let user;
    try {
      user = await userRepository.getByEmail(req.body.email);
    } catch (err) {
      return res.status(500).json({message: errorMessage(err)});
    }
    if (!user || !validatePassword(req.body.password, user.password)) {
      return res.status(400).json({message: "Invalid username/password"})
    }
    const lastLogin = user.lastLogin;
    const currentDate = moment();
    return userRepository.update(user, {
      lastLogin: currentDate
    })
      .then(() => {
        res.status(200).json({
          message: "Successful login!",
          user: {
            uid: user.id,
            isAdmin: user.isAdmin,
            lastLogin: lastLogin,
            token: generateToken(user)
          }
        });
      })
      .catch(err => res.status(500).send(errorMessage(err)));
  };

  this.forgotPassword = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array()
      });
    }
    // Check for user
    let user;
    try {
      user = await userRepository.getByEmail(req.body.email);
    } catch (err) {
      return res.status(500).json({message: errorMessage(err)})
    }
    if (!user) {
      res.status(200).json({message: "Instructions to reset your password have been sent to the email entered if an account with that email exists."});
      return;
    }
    // Create token and send it
    const token = crypto.randomBytes(16).toString('hex');
    const expires = moment().add(30, 'minutes').format();
    return forgotPasswordTokenRepository.add(req.body.email, token, expires)
      .then(() => {
        const emailClient = new EmailClient(emailClientTypes.NOREPLY);
        return emailClient.send(req.body.email,
          "Mobilise Password Reset",
          `Hello from Mobilise,
You have requested to reset your password.
Please click the following link to create a new password. 
Please try and use a password different to any that you have used previously.

${process.env.WEB_URL}/password-reset?token=${token}

This link will expire in 30 minutes.`)
      })
      .then(() => {
        res.status(200).json({message: "Instructions to reset your password have been sent to the email entered if an account with that email exists."});
      })
      .catch(err => {
        res.status(500).json({message: errorMessage(err)})
      });
  };

  this.resetPassword = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request",
        errors: errors.array()
      });
    }
    // Check they have provided a valid forgot password token
    let token;
    try {
      token = await forgotPasswordTokenRepository.getByToken(req.body.token);
    } catch (err) {
      return res.status(500).json({message: errorMessage(err)});
    }
    if (!token) {
      return res.status(400).json({message: "Invalid token"});
    }
    if (moment().isAfter(token.expiry)) {
      return res.status(400).json({
        message: "Token has expired. " +
          "Please request to reset your password again."
      });
    }

    // Check password
    if (!isSecure(req.body.newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, contain at least one uppercase letter, " +
          "one lowercase letter and one number/special character"
      });
    }

    // Check there is a user for the email
    let user;
    try {
      user = await userRepository.getByEmail(token.email);
    } catch (err) {
      return res.status(500).json({message: errorMessage(err)})
    }
    if (!user) {
      return res.status(400).json({message: "Invalid token"});
    }

    // Remove the token and update the password
    return forgotPasswordTokenRepository.removeByToken(req.body.token)
      .then(() => userRepository.update(user, {password: hashedPassword(req.body.newPassword)}))
      .then(() => res.status(200).json({message: "Success! Password has been changed."}))
      .catch(err => res.status(500).json({message: errorMessage(err)}))
  };

  this.validate = function (method) {
    switch (method) {
      case 'registerUser': {
        return [
          body('token').isString(),
          body('email').isEmail(),
          body('firstName').isString(),
          body('lastName').isString(),
          body('telephone').isNumeric(),
          body('password').isString()
        ]
      }
      case 'inviteAdmin': {
        return [
          body('adminKey').isString(),
          body('email').isEmail()
        ]
      }
      case 'loginUser': {
        return [
          body('email').isEmail(),
          body('password').isString()
        ]
      }
      case 'forgotPassword': {
        return [
          body('email').isEmail()
        ]
      }
      case 'resetPassword': {
        return [
          body('newPassword').isString()
        ]
      }
    }
  };

};

module.exports = new AuthController(
  userRepository,
  volunteerRepository,
  adminRepository,
  invitationTokenRepository,
  forgotPasswordTokenRepository
);

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id
    },
    config["jwt-secret"],
    {expiresIn: '24h'}
  );
}