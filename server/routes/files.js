let express = require('express');
let router = express.Router();
let controller = require('../controllers').FileController;
let { BucketClient } = require("../utils/bucket");
let multer = require('multer');
let multerS3 = require('multer-s3');
let upload;

if (process.env.NODE_ENV !== "test") {
  upload = multer({
    storage: multerS3({
      s3: new BucketClient().client,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      key: function (req, file, cb) {
        cb(null, file.originalname)
      }
    })
  });
}

/* List all the files. */
router.get('/', controller.get);

/* Download a file */
router.get('/:name', controller.downloadByName);

/* Upload a file */
router.post('/', upload.single("file"), function(req, res) {
  res.json({message: 'Successfully uploaded: ', file: req.file.originalname})
});

/* Delete a file */
router.delete('/:name', controller.deleteByName);

module.exports = router;
