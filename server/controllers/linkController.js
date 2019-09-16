const linkRepository = require("../repositories").LinkRepository;

let LinkController = function (linkRepository) {

  this.get = function (req, res) {
    linkRepository.getAll()
      .then(links => res.status(200).send({message: "Success!", links}))
      .catch(err => res.status(500).send({message: err}));
  };

  this.add = function (req, res) {
    if (!req.user.isAdmin) {
      res.status(400).json({message: "Only admin can add a link"});
      return;
    }
    if (!req.body.link || !req.body.name) {
      res.status(400).json({message: "Please provide both the link and name"});
      return;
    }
    linkRepository.add(req.body)
      .then(link => res.status(201).json({message: "Added link", link: link}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.deleteById = function (req, res) {
    if (!req.user.isAdmin) {
      res.status(400).json({message: "Only admin can add a link"});
      return;
    }
    linkRepository.getById(req.params.id)
      .then(quicklink => {
        if (!quicklink) {
          res.status(400).json({message: "No link exists with that id"});
          return;
        }
        return linkRepository.removeById(req.params.id);
      })
      .then(() => res.status(200).json({message: "Success! Removed link!"}))
      .catch(err => res.status(500).json({message: err}));
  }

};

module.exports = new LinkController(linkRepository);