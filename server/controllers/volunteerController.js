const volunteerRepository = require('../repositories').VolunteerRepository;

var VolunteerController = function(volunteerRepository) {
  
  this.volunteerRepository = volunteerRepository;

  this.list = function(req, res) {

    volunteerRepository
      .getAll()
      .then(volunteers => res.status(200).send(volunteers))
      .catch(err => res.status(500).send(err));

  }

  this.listShiftsByVolunteerId = function(req, res) {
    
    volunteerRepository.getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({message: "No volunteer with that id"});
        } else {
          return volunteer.getShifts();
        }
      })
      .then(shifts => res.status(200).send(shifts))
      .catch(err => res.status(500).send(err));

  }

}

module.exports = new VolunteerController(volunteerRepository);