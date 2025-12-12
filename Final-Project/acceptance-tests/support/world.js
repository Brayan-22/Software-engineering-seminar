import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from 'playwright';

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async launchBrowser() {
    const headless = process.env.HEADLESS !== 'false';

    this.browser = await chromium.launch({
      headless,
      //slowMo: 50 // Opcional: ralentiza un poco para ver qué pasa
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    this.page = await this.context.newPage();

    // Listeners para debugging (opcional)
    // this.page.on('console', msg => console.log('🖥️ PAGE LOG:', msg.text()));
    // this.page.on('pageerror', err => console.error('❌ PAGE ERROR:', err.message));
  }

  async closeBrowser() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

setWorldConstructor(CustomWorld);