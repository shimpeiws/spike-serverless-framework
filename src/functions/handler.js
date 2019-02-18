import ImageScraper from './ImageScraper';
import SimplePut from './SimplePut';
import SearchPixabay from './SearchPixabay';
import SQS from '../lib/SQS';

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

export const imageScraper = async (event, context, callback) => {
  const base64Image = await ImageScraper.screenshot(JSON.parse(event.body).url, event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: base64Image,
      input: event.body
    })
  };

  callback(null, response);
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

export const puToSQS = (event, context, callback) => {
  const client = SQS.client(event);
  const queueName = `puToSQS1234`;
  client.createQueue({ QueueName: queueName }, err => {
    if (err) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Success',
          input: event
        })
      };
      callback(null, response);
    } else {
      const params = {
        QueueUrl: SQS.queueUrl(queueName, event),
        MessageBody: 'Hello'
      };
      client.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Error', err);
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
