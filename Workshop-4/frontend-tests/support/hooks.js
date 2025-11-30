import { Before, After } from '@cucumber/cucumber';

Before(async function () {
  await this.launchBrowser();
});

After(async function () {
  await this.closeBrowser();
});
