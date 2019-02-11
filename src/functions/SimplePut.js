import AWS from 'aws-sdk';
import uuid from 'uuid';

export default class SimplePut {
  static dynamo(event) {
    if (event.isOffline) {
      return new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      });
    }
    return AWS.DynamoDB.DocumentClient();
  }
  static async put(message, event) {
    const dynamo = this.dynamo(event);
    const timestamp = new Date().getTime();
    const params = {
      TableName: process.env.TEST_DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        message,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };
    await dynamo.put(params, error => {
      // handle potential errors
      if (error) {
        console.log('dynamo error!!!', error);
        return;
      }
    });
  }
}
