let express = require('express');
let router = express.Router();
let controller = require('../controllers').FileController;
let AWS = require('aws-sdk');
let multer = require('multer');
let multerS3 = require('multer-s3');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

let s3 = new AWS.S3();

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});

/* List all the files. */
router.get('/', controller.get);

/* Download a file */
router.get('/:name', controller.downloadByName);

/* Upload a file */
router.post('/', upload.single("file"), function(req, res) {
  res.json({message: 'Successfully uploaded: ', file: req.file.originalname})
});

module.exports = router;
