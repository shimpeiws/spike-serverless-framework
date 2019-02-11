import AWS from 'aws-sdk';

export default class DynamoDB {
  static client(event) {
    if (event.isOffline) {
      return new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      });
    }
    return AWS.DynamoDB.DocumentClient();
  }
}
