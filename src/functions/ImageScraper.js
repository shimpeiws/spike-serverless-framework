import puppeteer from 'puppeteer';
import launchChrome from '@serverless-chrome/lambda';
import CDP from 'chrome-remote-interface';
import AWS from 'aws-sdk';
import uuid from 'uuid';

export default class ImageScraper {
  static dynamoDb() {
    return new AWS.DynamoDB.DocumentClient();
  }
  static async writeToDynamo(url, base64Image) {
    const dynamo = this.dynamoDb();
    const timestamp = new Date().getTime();
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        url,
        base64Image,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };
    await dynamo.put(params, error => {
      // handle potential errors
      if (error) {
        console.error(error);
        return;
      }
    });
  }
  static async screenshot(url) {
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
    await this.writeToDynamo(url, res);
    browser.close();
    return res;
  }
}
