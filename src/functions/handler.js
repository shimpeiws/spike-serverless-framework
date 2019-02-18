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
  console.info('!!!event!!!', event.Records[0].body);
  const query = event.Records[0].body;

  await SearchPixabay.search(query, event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: query
    })
  };
  callback(null, response);
};
