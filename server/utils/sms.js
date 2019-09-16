const AWS = require("aws-sdk");

class SMSClient {
  constructor() {
    this.client = new AWS.SNS({ region: process.env.AWS_SMS_REGION, apiVersion: '2010-03-31' });
  }
  
  send(to, message) {
    const params = {
      Message: message,
      PhoneNumber: to,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          'DataType': 'String',
          'StringValue': 'Mobilise'
        }
      }
    };
    return this.client.publish(params).promise();
  }
}

module.exports = {
  SMSClient
};