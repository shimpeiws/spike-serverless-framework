import SimplePut from './SimplePut';
import SearchPixabay from './SearchPixabay';
import SQS from '../lib/SQS';
import DynamoDB from '../lib/DynamoDB';
import ApiGateway from '../lib/ApiGateway';

export const hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

export const simplePut = async (event, context, callback) => {
  const message = JSON.parse(event.body).message;
  await SimplePut.put(message, event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message,
      input: event.body
    })
  };

  callback(null, response);
};

export const searchPixabay = async (event, context, callback) => {
  console.info('event', event.queryStringParameters.query);
  const q = event.queryStringParameters.query;
  await SearchPixabay.search(q, event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: q
    })
  };
  callback(null, response);
};

export const putToSQS = (event, context, callback) => {
  const client = SQS.client(event);
  const queueName = process.env.TEST_QUEUE_NAME;
  client.createQueue({ QueueName: queueName }, err => {
    if (err) {
      console.info('!!!SQS createQueue error!!!', err);
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Fail createQueue',
          input: event
        })
      };
      callback(null, response);
    } else {
      const message = JSON.parse(event.body).message;
      const params = {
        QueueUrl: SQS.queueUrl(queueName, event),
        MessageBody: message
      };
      console.info('!!!SQS MESSAGE PARAMS!!!', params);
      client.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Error create message', err);
          const response = {
            statusCode: 400,
            body: JSON.stringify({
              message: 'Error!',
              input: event
            })
          };
          callback(null, response);
        } else {
          console.log('Success', data.MessageId);
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Success',
              input: event
            })
          };
          callback(null, response);
        }
      });
    }
  });
};

export const sqsTriggered = async (event, context, callback) => {
  const apiGateway = ApiGateway.client(event);
  const dynamo = DynamoDB.client(event);

  await SearchPixabay.search(query, event);
  const query = event.Records[0].body;

  const params = {
    TableName: process.env.CONNECTIONS_DYNAMODB_TABLE,
    ProjectionExpression: 'ConnectionId'
  };
  const socketClients = await dynamo.scan(params).promise();
  socketClients.Items.map(async ({ ConnectionId }) => {
    const imageParams = {
      TableName: process.env.IMAGES_DYNAMODB_TABLE
    };
    const images = await dynamo.scan(imageParams).promise();
    let resObj = {};
    images.Items.map(item => {
      resObj[item.query] = item.urls;
    });
    const request = {
      ConnectionId: ConnectionId,
      Data: JSON.stringify(resObj)
    };
    await apiGateway.postToConnection(request).promise();
  });

  callback(null, { statusCode: 200, body: JSON.stringify({ message: 'success' }) });
};

export const connectionManager = async (event, context, callback) => {
  const dynamo = DynamoDB.client(event);
  const timestamp = new Date().getTime();
  if (event.requestContext.eventType === 'CONNECT') {
    const params = {
      TableName: process.env.CONNECTIONS_DYNAMODB_TABLE,
      Item: { ConnectionId: event.requestContext.connectionId }
    };
    await dynamo.put(params, error => {});
    callback(null, { statusCode: 200, body: JSON.stringify({ message: 'connected' }) });
  } else if (event.requestContext.eventType === 'DISCONNECT') {
    const params = {
      TableName: process.env.CONNECTIONS_DYNAMODB_TABLE,
      Key: { ConnectionId: event.requestContext.connectionId }
    };
    await dynamo.delete(params, error => {});
    callback(null, { statusCode: 200, body: JSON.stringify({ message: 'disconnected' }) });
  }
};

export const defaultMessage = async (event, context, callback) => {
  const params = {
    ConnectionId: event.requestContext.connectionId,
    Data: 'Error: Invalid action type'
  };
  const apiGateway = ApiGateway.client(event);
  await apiGateway.postToConnection(params, error => {});
  callback(null, { statusCode: 500, body: JSON.stringify({ message: 'invalid message' }) });
};

export const sendMessage = async (event, context, callback) => {
  const dynamo = DynamoDB.client(event);
  const apiGateway = ApiGateway.client(event);

  const params = {
    TableName: process.env.CONNECTIONS_DYNAMODB_TABLE,
    ProjectionExpression: 'ConnectionId'
  };
  const socketClients = await dynamo.scan(params).promise();
  console.info('socketClients', socketClients);
  socketClients.Items.map(async ({ ConnectionId }) => {
    const request = {
      ConnectionId: ConnectionId,
      Data: JSON.parse(event.body).data
    };
    console.info('postToConnection', request);
    await apiGateway.postToConnection(request).promise();
  });
  callback(null, { statusCode: 200, body: JSON.stringify({ message: 'success' }) });
};
