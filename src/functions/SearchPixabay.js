import AWS from 'aws-sdk';
import uuid from 'uuid';
import axios from 'axios';

export default class SearchPixabay {
  static async search(query) {
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
    const sliced = res.data.hits.slice(0, 9);
    console.info('res', sliced[0]);
    console.info('res', sliced.map(obj => obj.webformatURL));
    return sliced.map(obj => obj.webformatURL);
  }
}
