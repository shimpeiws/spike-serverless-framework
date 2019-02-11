import AWS from 'aws-sdk';
import uuid from 'uuid';
import DynamoDB from '../lib/DynamoDB';

export default class SimplePut {
  static async put(message, event) {
    const dynamo = DynamoDB.client(event);
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
