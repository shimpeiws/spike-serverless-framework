import puppeteer from 'puppeteer';
import launchChrome from '@serverless-chrome/lambda';
import CDP from 'chrome-remote-interface';
import AWS from 'aws-sdk';
import uuid from 'uuid';

export default class ImageScraper {
  static async screenshot(url, event) {
    const slsChrome = await launchChrome();
    const browser = await puppeteer.connect({
      browserWSEndpoint: (await CDP.Version()).webSocketDebuggerUrl
    });
    const context = browser.defaultBrowserContext();
    const page = await context.newPage();
    await page.setViewport({ width: 320, height: 240 });
    await page.goto(url);
    await page.waitFor(1000);
    const res = await page.screenshot({ fullPage: false, type: 'jpeg', encoding: 'base64' });
    console.info('offline', event.isOffline);
    const dynamo = event.isOffline
      ? AWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
        })
      : new AWS.DynamoDB.DocumentClient();
    const timestamp = new Date().getTime();
    console.info('params!!!', process.env.DYNAMODB_TABLE);
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        url,
        base64Image: res,
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
    browser.close();
    return res;
  }
}
