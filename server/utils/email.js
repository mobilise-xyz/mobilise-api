const nodemailer = require("nodemailer");

const emailClientTypes = {
  NOREPLY: "NOREPLY",
  CONTACT: "CONTACT"
};

class EmailClient {
  constructor(type) {
    let auth;
    let smtpFrom;

    switch (type) {
      case emailClientTypes.NOREPLY:
        auth = {
          user: process.env.NOREPLY_MAIL_SENDER_USER,
          pass: process.env.NOREPLY_MAIL_SENDER_PASS
        };
        smtpFrom = process.env.NOREPLY_MAIL_SENDER_USER;
        break;
      case emailClientTypes.CONTACT:
        auth = {
          user: process.env.CONTACT_MAIL_SENDER_USER,
          pass: process.env.CONTACT_MAIL_SENDER_PASS
        };
        smtpFrom = process.env.CONTACT_MAIL_SENDER_USER;
        break;
      default:
        throw TypeError("No such client type")
    }

    this.client = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: auth
    });

    this.smtpFrom = smtpFrom;

  }


  send(to, subject, message) {
    const mailOptions = {
      from: this.smtpFrom,
      to: to,
      subject: subject,
      text: message
    };
    return this.client.sendMail(mailOptions);
  }
}

module.exports = {
  EmailClient,
  emailClientTypes
};