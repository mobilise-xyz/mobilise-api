var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
var s3 = new AWS.S3();

let FileController = function () {

  this.get = function (req, res) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };
    s3.listObjects(params, function (err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
  };

  this.downloadByName = function (req, res) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: req.params.name
    };
    s3.getObject(params, function(err, data) {
      if (err === null) {
        res.attachment(req.params.name);
        res.send(data.Body);
      } else {
        res.status(404).send({message: "File does not exist"});
      }
    });
  }
};

module.exports = new FileController();