const userRepository = require('../repositories').UserRepository;

module.exports = {
  getById: function(req, res) {
      userRepository.getById(req.params.id)
      .then(user => {
          res.status(200).send({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName
          });
      })
      .catch(err => res.status(500).send(err))
  }
};
