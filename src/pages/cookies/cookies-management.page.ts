import { Page, Locator } from '@playwright/test';

export class CookieManagerPager {
  private readonly page: Page;
  private readonly buttonAcceptAll: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonAcceptAll = page.getByRole('button', { name: 'Agree to all' });
  }

  async acceptAll() {
    await this.buttonAcceptAll.waitFor({ state: 'attached' });
    await this.buttonAcceptAll.click();
    await this.buttonAcceptAll.waitFor({ state: 'hidden' });
  }
}
