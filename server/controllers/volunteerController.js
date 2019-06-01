const volunteerRepository = require('../repositories').VolunteerRepository;

var VolunteerController = function(volunteerRepository) {
  
  this.volunteerRepository = volunteerRepository;

  this.list = function(req, res) {

    volunteerRepository
      .getAll()
      .then(volunteers => res.status(200).send(volunteers))
      .catch(err => res.status(500).send(err));

  }

}

module.exports = new VolunteerController(volunteerRepository);