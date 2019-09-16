const AWS = require("aws-sdk");

class BucketClient {
  constructor() {
    this.client = new AWS.S3({region: process.env.AWS_S3_REGION});
  }

  listContents() {
    return this.client.listObjects({Bucket: process.env.AWS_S3_BUCKET_NAME}).promise();
  }

  getByName(name) {
    return this.client.getObject(
      {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: name
      }).promise()
  }

  deleteByName(name) {
    return this.client.deleteObject(
      {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: name
      }).promise()
  }

}

module.exports = {
  BucketClient
};