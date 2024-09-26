import puppeteer, { Browser, Page } from "puppeteer";
import { setupPuppeteer } from "./scraper";
import { urlToUrlWithoutFlightMarker } from "next/dist/client/components/app-router";

export async function scrapeNikeProduct(url: string) {
  if (!url) return;

  let browser: Browser | null = null;

  try {
    const { browser: launchedBrowser, page } = await setupPuppeteer();
    browser = launchedBrowser;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const data = await page.evaluate(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const title = document.querySelector('#title-container h1')?.textContent?.trim() || '';
      let currentPrice = document.querySelector('#price-container span')?.textContent?.trim() || '0';
      currentPrice = currentPrice.replace(/\D/g, '');
      const available = (currentPrice != '0' && !!currentPrice);
      const image = document.querySelector('#hero-image img')?.getAttribute('src') || 
                    document.querySelector('.css-3wfemz')?.getAttribute('src') || '';

      const scrapedProduct : ProductData = {
        name: title,
        url: url,
        available: available,
        currency: 'lei',
        imageUrl: image,
        priceHistory: [Number(currentPrice) / 100],
      };

      return scrapedProduct;
    }, url);

    console.log(`Scraping completed: ${data}`);
    return data;
  } catch (error: any) {
    console.error(`Failed to scrape product: ${error.message}`);
    throw new Error(`Failed to scrape product: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

export async function scrapeNikePrice(url: string) {
  if (!url) return;

  let browser: Browser | null = null;

  try {
    const { browser: launchedBrowser, page } = await setupPuppeteer();
    browser = launchedBrowser;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const data = await page.evaluate(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      let currentPrice = document.querySelector('#price-container span')?.textContent?.trim() || '0';
      currentPrice = currentPrice.replace(/\D/g, '');
      const available = (currentPrice != '0' && !!currentPrice);

      return {price: Number(currentPrice) / 100, available};
    }, url);

    console.log(`Scraping completed: ${data}`);
    return data;
  } catch (error: any) {
    console.error(`Failed to scrape product: ${error.message}`);
    throw new Error(`Failed to scrape product: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}