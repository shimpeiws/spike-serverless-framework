import puppeteer from 'puppeteer';
import launchChrome from '@serverless-chrome/lambda';
import CDP from 'chrome-remote-interface';

export default class ImageScraper {
  static async images(url) {
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
    browser.close();
    return res;
  }
}
