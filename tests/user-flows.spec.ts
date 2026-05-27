import { test, expect } from '@playwright/test';

test.describe('Movie Friend Core User Flows', () => {

  test('User can log in and view the cold-start dashboard', async ({ page }) => {
    // navigates to the login page
    await page.goto('http://localhost:3000/login');

    // fills out the login form
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');

    // submits the form
    await page.click('button[type="submit"]');

    // verifies successful redirect to the dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // verifies the UI loaded the correct heading
    const dashboardHeading = page.locator('h2');
    await expect(dashboardHeading).toContainText('Here are my picks:');

    // verifies that recommendations rendered
    const movieCards = page.locator('.movie-card');
    await expect(movieCards).toHaveCount(20, { timeout: 10000 }); 
  });


  test('User can rate a movie and it appears in their profile', async ({ page }) => {
    // logs in to establish a session
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // clicks the first movie card to view its details
    const firstMovie = page.locator('.movie-card').first();
    await firstMovie.click();

    // verifies hitting the MovieDetailPage
    await expect(page).toHaveURL(/.*\/movie\/\d+/);

    // grabing the title from the h1 tag to verify it later
    const movieTitle = await page.locator('h1').textContent();

    // Interacts with the rating component
    // playwright hovers the image container to reveal the star UI, then clicks the 10-star button
    await page.locator('.group').hover(); 
    await page.click('button[aria-label="Rate 10 stars"]');

    // navigates to the user's personal ratings page
    await page.goto('http://localhost:3000/my-ratings');

    // verifies the rated movie now appears in their collection
    await expect(page.locator('body')).toContainText(movieTitle as string);
  });
});