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

    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res.status(400).send({message: "You can only update your own availability."})
      return
    }
    
    volunteerRepository
      .getById(req.params.id)
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

  this.updateAvailability = function(req, res) {

    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res.status(400).send({message: "You can only update your own availability."})
      return
    }

    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({message:  "No volunteer with that id"})
        } else {

          volunteerRepository
            .updateAvailability(req.params.id, req.body.availability)
            .then(result => res.status(201).send({
              message: "Availability Updated Successfuly"
            }))
            .catch(error => res.status(400).send(error))

        }
      })
      .catch(error => res.status(500).send(error))
  }

}

module.exports = new VolunteerController(volunteerRepository);