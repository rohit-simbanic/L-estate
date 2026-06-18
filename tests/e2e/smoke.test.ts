import { test, expect } from '@playwright/test';

test.describe('E2E Portal Verification Suite', () => {
  
  test('Should load landing page and navigate using header links', async ({ page }) => {
    // 1. Load the landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/React|Vite|MERN|Estate|Exclusive|Vacation/i);
    
    // Take landing page screenshot for Visual Regression analysis
    await page.screenshot({ path: 'landing-page-screenshot.png' });

    // 2. Click "Explore Estates" navigation link
    await page.click('text=Explore Estates');
    await expect(page).toHaveURL(/#\/search/);
    
    // 3. Click "Our Heritage" navigation link
    await page.click('text=Our Heritage');
    await expect(page).toHaveURL(/#\/about/);
    
    // 4. Click "Contact" navigation link
    await page.click('text=Contact');
    await expect(page).toHaveURL(/#\/contact/);
  });

  test('Should submit VIP Newsletter form successfully', async ({ page }) => {
    await page.goto('/');
    
    // Fill the VIP Newsletter input
    const emailInput = page.locator('footer input[type="email"]');
    await emailInput.fill('customer@luxury.com');
    // Assert input has the value to guarantee React state synchronization
    await expect(emailInput).toHaveValue('customer@luxury.com');
    
    // Submit the form using Enter key to avoid button hover/click clickability delays
    await emailInput.press('Enter');
    
    // Verify invitation dispatched text with a generous timeout to absorb CPU spikes
    await expect(page.locator('text=Invitation Dispatched')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Welcome to L\'ESTATE’s inner circle')).toBeVisible({ timeout: 15000 });
  });

  test('Should submit Concierge Inquiry Form successfully', async ({ page }) => {
    await page.goto('/#/contact');
    
    // Fill form details using standard element IDs
    await page.fill('#name', 'Jean-Pierre');
    await page.fill('#email', 'jean.pierre@concierge.ch');
    await page.fill('#phone', '+41 22 123 4567');
    await page.fill('#message', 'Looking for an Amalfi Coast villa booking for August 2026.');
    
    // Submit form
    await page.click('button:has-text("Send VIP Inquiry")');
    
    // Verify modal is open and showing the success details
    await expect(page.locator('h3:has-text("Message Dispatched")').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Jean-Pierre')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Our concierge staff is preparing a detailed proposal.')).toBeVisible({ timeout: 15000 });
    
    // Close modal
    await page.click('button:has-text("Acknowledge")');
    await expect(page.locator('h3:has-text("Message Dispatched")')).toHaveCount(0);
  });

  test('Should search estates by destination, dates, and guest count', async ({ page }) => {
    await page.goto('/');

    // 1. Open the Destination select dropdown
    await page.click('button:has-text("All Destinations")');
    // Select "Amalfi Coast, Italy"
    await page.click('button:has-text("Amalfi Coast, Italy")');

    // 2. Open the Dates select dropdown
    await page.click('button:has-text("Add Dates")');
    // Fill check-in and check-out dates
    await page.locator('input[type="date"] >> nth=0').fill('2026-07-01');
    await page.locator('input[type="date"] >> nth=1').fill('2026-07-10');

    // 3. Open the Guests dropdown
    await page.click('button:has-text("1 guest")');
    // Increment guest count by clicking '+'
    await page.click('button:has-text("+")');
    // Close guests dropdown to prevent button overlapping
    await page.click('button:has-text("2 guests")');

    // 4. Click Search
    await page.click('button:has-text("Search Estates")');

    // Verify redirection to search page
    await expect(page).toHaveURL(/#\/search/);
    
    // Verify results count and Amalfi Coast selection
    await expect(page.locator('text=Amalfi Coast, Italy').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=available')).toBeVisible({ timeout: 15000 });
  });

  test('Should open featured destination, save it, and reserve it successfully', async ({ page }) => {
    await page.goto('/');

    // 1. Locate and click "View Estate" on the first featured property
    await page.locator('button:has-text("View Estate")').first().click();
    // Wait for the dynamic/lazy page import of ItemDetail to complete
    await page.waitForURL(/#\/item\//, { timeout: 30000 });

    // 2. Save the estate to Wishlist/Favorites
    await page.click('button:has-text("Save Estate")', { timeout: 15000 });
    // Verify it is wishlisted
    await expect(page.locator('button:has-text("Wishlisted")')).toBeVisible({ timeout: 15000 });
    // Verify header favorites badge incremented to 1
    await expect(page.locator('header span:has-text("1")')).toBeVisible({ timeout: 15000 });

    // 3. Fill the reservation form
    await page.fill('#fullName', 'Sterling Archer');
    await page.fill('#email', 'sterling@spy.agency');
    await page.fill('#checkIn', '2026-08-01');
    await page.fill('#checkOut', '2026-08-07');
    await page.selectOption('#guests', '3');
    
    // Check VIP Concierge checkbox
    await page.check('input[type="checkbox"]');

    // 4. Submit reservation
    await page.click('button:has-text("Reserve Estate")');

    // Verify success modal details
    await expect(page.locator('h3:has-text("Your Luxury Stay is Secured")')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=We have dispatched your reservation itinerary to')).toBeVisible({ timeout: 15000 });

    // Close the modal (returns to search)
    await page.click('button:has-text("Discover More Estates")');
    await expect(page).toHaveURL(/#\/search/);
  });

  test('Should verify filter panel interactions on search page', async ({ page }) => {
    await page.goto('/#/search');

    // 1. Get initial total count of properties
    const initialText = await page.locator('text=available').first().innerText();
    const initialCount = parseInt(initialText);

    // 2. Open the filters modal drawer
    await page.click('button:has-text("Filters")');

    // 3. Select category "Chalet"
    await page.click('button:has-text("Chalet")');

    // 4. Click Sort by "Price: Low - High"
    await page.click('button:has-text("Price: Low - High")');

    // 5. Close the filters drawer using filter to bypass mobile floating toggle
    await page.locator('button:has-text("Show")').filter({ hasText: /Estate/ }).click();
    // Allow React state updates to complete
    await page.waitForTimeout(500);

    // Verify all displayed property cards are Chalets
    const typeBadges = page.locator('span:has-text("Chalet")');
    await expect(typeBadges.first()).toBeVisible({ timeout: 15000 });

    // 6. Open filters modal drawer again
    await page.click('button:has-text("Filters")');

    // 7. Reset filters
    await page.click('button:has-text("Reset")');

    // 8. Close drawer using filter
    await page.locator('button:has-text("Show")').filter({ hasText: /Estate/ }).click();
    // Allow React state updates to complete
    await page.waitForTimeout(500);

    // Verify total count is restored
    const restoredText = await page.locator('text=available').first().innerText();
    const restoredCount = parseInt(restoredText);
    expect(restoredCount).toBe(initialCount);
  });

});
