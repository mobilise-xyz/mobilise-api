const { BucketClient } = require("../utils/bucket");
const moment = require('moment');
const {validationResult, param} = require('express-validator');


let FileController = function () {

  this.get = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Invalid request", errors: errors.array()});
    }

    const client = new BucketClient();

    client.listContents()
      .then(data => {
        let files = [];
        data.Contents.forEach(result => {
          files.push({
            "name": result.Key,
            "modified": moment(result.LastModified).format(),
            "size": result.Size
          })
        });
        res.status(200).send({message: "Success!", files: files});
      })
      .catch(err => {
        res.status(500).json({message: err});
      });
  };

  this.downloadByName = function (req, res) {
    const client = new BucketClient();

    client.getByName(req.params.name)
      .then(data => {
        res.attachment(req.params.name);
        res.send(data.Body);
      })
      .catch(() => res.status(404).send({message: "File does not exist"}));
  };

  this.deleteByName = function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Invalid request", errors: errors.array()});
    }

    const client = new BucketClient();

    if (!req.user.isAdmin) {
      res.status(400).json({message: "Only an admin can delete a file"});
      return;
    }

    client.deleteByName(req.params.name)
      .then(data => res.status(200).json({message: "File deleted", data: data}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.validate = function(method) {
    switch (method) {
      case 'deleteByName':
      case 'downloadByName': {
        return [
          param('name').isString()
        ]
      }
    }
  }
};

module.exports = new FileController();