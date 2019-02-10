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
  const message = await ImageScraper.images(
    'https://www.google.com/search?q=puppeteer&hl=en&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjhpoTtmbHgAhUBfXAKHe_5CdIQ_AUIDigB&biw=1680&bih=917'
  );
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message,
      input: event
    })
  };

  callback(null, response);
};
