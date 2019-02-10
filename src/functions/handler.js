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
  const base64Image = await ImageScraper.screenshot(JSON.parse(event.body).url);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: base64Image,
      input: event.body
    })
  };

  callback(null, response);
};
