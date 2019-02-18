import AWS from 'aws-sdk';

export default class SQS {
  static get LOCAL_ENDPOINT() {
    return 'http://localhost:9324';
  }
  static localClient() {
    const sqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      region: 'localhost'
    });
    sqs.setEndpoint(this.LOCAL_ENDPOINT);
    return sqs;
  }
  static queueUrl(queueName, event) {
    if (event.isOffline) {
      return `${this.LOCAL_ENDPOINT}/queue/${queueName}`;
    }
    return `${process.env.SQS_BASE_URL}/${queueName}`;
  }
  static client(event) {
    if (event.isOffline) {
      return this.localClient();
    }
    return new AWS.SQS({ apiVersion: '2012-11-05' });
  }
}
