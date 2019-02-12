import uuid from 'uuid';
import axios from 'axios';
import DynamoDB from '../lib/DynamoDB';

export default class SearchPixabay {
  static async search(query, event) {
    const client = axios.create({
      baseURL: 'https://pixabay.com/api',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'
    });
    const res = await client.get('/', {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: query
      }
    });
    console.info('res', res);
    if (!res.data || !res.data.hits) {
      return;
    }
    const sliced = res.data.hits.slice(0, 9);
    console.info('res', sliced[0]);
    console.info('res', sliced.map(obj => obj.webformatURL));
    const urls = sliced.map(obj => obj.webformatURL);

    const dynamo = DynamoDB.client(event);
    const timestamp = new Date().getTime();
    const params = {
      TableName: process.env.IMAGES_DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        query,
        urls,
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
