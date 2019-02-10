import ImageScraper from './ImageScraper';

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
  const message = await ImageScraper.images();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message,
      input: event
    })
  };

  callback(null, response);
};
