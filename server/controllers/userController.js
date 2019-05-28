const User = require('../models').User;

module.exports = {
  getById: function(req, res) {
      User.findOne({where: {id: req.params.id}, attributes: ['id', 'firstName', 'lastName', 'email']})
      .then((user) => {
          res.status(200).send(user);
      })
      .catch((err) => {
          res.status(400).send(err);
      })
  }
};