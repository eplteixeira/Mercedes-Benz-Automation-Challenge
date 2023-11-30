import { test, expect } from '@playwright/test';
import { CookieManagerPager } from '../src/pages/cookies/cookies-management.page';
import Utils from '../src/utils';

test.describe('Enquire Now - Mercedes-Benz', () => {
  test('Validate the negative path of enquiring the highest price at Mercedes-Benz', async ({ page }) => {
    await page.goto('https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo');
    const cookieMng = new CookieManagerPager(page);
    await cookieMng.acceptAll();

    /**
     * PHASE 1 - Select your location
     */
    // Continue is disable
    await expect(page.locator('[data-test-id="state-selected-modal__close"]')).toBeDisabled();
    // State: New South Wales
    await page.selectOption('xpath=//div[contains(@data-test-id,"modal-popup")]//wb-select-control//select', {
      label: 'New South Wales'
    });
    // Postal Code: 2007
    await page.locator('[data-test-id="modal-popup__location"]').getByLabel('', { exact: true }).fill('2000');
    // Purpose: private
    await page.locator('label').filter({ hasText: 'Private' }).check();
    await expect(page.locator('label').filter({ hasText: 'Private' })).toBeChecked();
    // Click Continue
    await expect(page.locator('[data-test-id="state-selected-modal__close"]')).toBeEnabled();
    await page.locator('[data-test-id="state-selected-modal__close"]').click();

    /**
     * Phase 2 - Click in Pre-Owned and choose a color
     */
    let filterClosed = page.locator('xpath=//div[@class="wrapper"]/div/span');
    await filterClosed.waitFor({ state: 'visible' });
    if ((await filterClosed.count()) == 1) {
      filterClosed.click();
    }
    await page.getByRole('button', { name: 'Pre-Owned' }).click();

    await page.waitForURL('https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/used');

    await page
      .locator('xpath=//div[@class="wrapper show"]//div/p[contains(text(), "Initial Registration")]')
      .scrollIntoViewIfNeeded();
    await page.locator('xpath=//div[@class="wrapper show"]//div/p[contains(text(), "Colour")]').click();
    await page.locator('xpath=//div[@class="wrapper show"]//div//span[contains(text(), "Colour")]').click();
    await page.getByText('BRILLANTBLUE metallic').scrollIntoViewIfNeeded();
    await page.getByText('BRILLANTBLUE metallic').click();
    await page.locator('xpath=//div[@class="dcp-loader"]').waitFor({ state: 'hidden' });

    await expect(page.locator('[data-test-id="dcp-cars-srp-result-amount__number"]').getByText('2')).toHaveText('2');

    /**
     * Phase 3 - Pick the most expensive car and save VIN and Model year
     */
    let arrayOfPrices = page
      .locator('xpath=//div[@data-test-id="dcp-cars-product-tile-price"]/span[1]')
      .allInnerTexts();
    let maxPriceText = await Utils.maxPrice(arrayOfPrices);
    await page.getByText(maxPriceText).waitFor({ state: 'visible' });
    await page.getByText(maxPriceText).click();
    await expect(page.getByTestId('dcp-buy-box__contact-seller')).toBeVisible();
    // Retrieve VIM and Model Year

    let vinNumber = await page
      .locator('xpath=//li[@data-test-id="dcp-vehicle-details-list-item-11"]/span[2]')
      .innerText();
    console.log('VIN NUMBER: ' + vinNumber);
    let modelYear = await page
      .locator('xpath=//li[@data-test-id="dcp-vehicle-details-list-item-3"]/span[2]')
      .innerText();
    console.log('ModelYear: ' + modelYear);

    await page.getByTestId('dcp-buy-box__contact-seller').click();
    await page.locator('xpath=//div[@class="dcp-loader"]').waitFor({ state: 'hidden' });
    await expect(page.getByText('Contact Details and Account Creation')).toBeVisible();

    /**
     * PHASE 4 - Fill the Contact Details and Account Creation
     */
    await page.getByTestId('rfq-contact__first-name').locator('input').fill('Emanuel');
    await page.getByTestId('rfq-contact__last-name').locator('input').fill('Teixeira');
    await page.getByTestId('rfq-contact__email').locator('input').fill('mail@mail');
    await page.getByTestId('rfq-contact__phone').locator('input').fill('0441234567');
    await page.getByTestId('rfq-contact__postal-code').locator('input').fill('2000');
    await page.locator('label').filter({ hasText: 'I have read and understood' }).locator('wb-icon').check();

    // Check for the error message
    await expect(page.getByText('An error has occurred.Please')).not.toBeAttached();
    await page.getByTestId('dcp-rfq-contact-button-container__button-next').click();
    await expect(page.getByText('An error has occurred.Please')).toBeVisible();
  });
});
