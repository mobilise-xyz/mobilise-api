const linkRepository = require("../repositories").LinkRepository;
const {validationResult, body, param} = require('express-validator');
const {errorMessage} = require("../utils/error");

let LinkController = function (linkRepository) {

  this.get = async function (req, res) {
    await linkRepository.getAll()
      .then(links => res.status(200).send({message: "Success!", links}))
      .catch(err => res.status(500).send({message: err}));
  };

  this.add = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admin can add a link"});
      return;
    }
    await linkRepository.add(req.body)
      .then(link => res.status(201).json({message: "Added link", link: link}))
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.deleteById = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admin can add a link"});
      return;
    }
    await linkRepository.getById(req.params.id)
      .then(quicklink => {
        if (!quicklink) {
          res.status(400).json({message: "No link exists with that id"});
          return;
        }
        return linkRepository.removeById(req.params.id);
      })
      .then(() => res.status(200).json({message: "Success! Removed link!"}))
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.validate = function(method) {
    switch (method) {
      case 'add': {
        return [
          body('url').isURL(),
          body('name').isString()
        ]
      }
      case 'deleteById': {
        return [
          param('id').isUUID()
        ]
      }
    }
  }
};

module.exports = new LinkController(linkRepository);