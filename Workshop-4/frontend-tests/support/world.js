import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium } from 'playwright';

class CustomWorld {
  async launchBrowser() {
    const headless = process.env.HEADLESS !== 'false';
    this.browser = await chromium.launch({ headless });
    this.page = await this.browser.newPage();
  }
  async closeBrowser() {
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
