const AWS = require('aws-sdk');
const moment = require('moment');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

let FileController = function () {

  this.get = function (req, res) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };
    s3.listObjects(params, (err, data) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        let files = [];
        data.Contents.forEach(result => {
          files.push({
            "name": result.Key,
            "modified": moment(result.LastModified).format(),
            "size": result.Size
          })
        });
        res.status(200).send({message: "Success!", files: files});
      }
    });
  };

  this.downloadByName = function (req, res) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: req.params.name
    };
    s3.getObject(params, (err, data) => {
      if (err === null) {
        res.attachment(req.params.name);
        res.send(data.Body);
      } else {
        res.status(404).send({message: "File does not exist"});
      }
    });
  };

  this.deleteByName = function (req, res) {
    if (!req.user.isAdmin) {
      res.status(400).json({message: "Only an admin can delete a file"});
      return;
    }
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: req.params.name
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({message: "File deleted", data: data})
      }
    });
  }
};

module.exports = new FileController();