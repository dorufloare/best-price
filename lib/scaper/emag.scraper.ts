import puppeteer, { Browser, Page } from "puppeteer";
import { setupPuppeteer } from "./scraper";
import { urlToUrlWithoutFlightMarker } from "next/dist/client/components/app-router";

export async function scrapeEmagProduct(url: string) {
  if (!url) return;

  let browser: Browser | null = null;

  try {
    const { browser: launchedBrowser, page } = await setupPuppeteer();
    browser = launchedBrowser;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const data = await page.evaluate(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const title = document.querySelector('.page-title')?.textContent?.trim() || '';
      const currentPriceText = document.querySelector('.product-new-price')?.textContent?.trim() || '';
      const originalPriceText = document.querySelector('.rrp-lp30d-content')?.textContent?.trim() || currentPriceText;
      const currentPrice = (currentPriceText.replace(/[^\d.-]/g, '')) || '0';
      const originalPrice = (originalPriceText.replace(/[^\d.-]/g, '')) || currentPrice;
      const available = (currentPrice != '0' && !!currentPrice);
      const image = document.querySelector('.product-gallery-image img')?.getAttribute('src') || '';

      function processPriceEmag(priceText: string) {
        priceText = priceText.replace(/\./g, '');
        const priceLei = priceText.slice(0, -2);
        const priceBani = priceText.slice(-2);
        return Number(`${priceLei}.${priceBani}`);
      }

      const processedCurrentPrice = processPriceEmag(currentPrice);
      const processedOriginalPrice = processPriceEmag(originalPrice);

      console.log("ori", processedOriginalPrice);

      const scrapedProduct : ProductData = {
        name: title,
        url: url,
        available: available,
        currency: 'lei',
        imageUrl: image,
        priceHistory: [processedCurrentPrice],
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

export async function scrapeEmagPrice(url: string) {
  if (!url) return;

  let browser: Browser | null = null;

  try {
    const { browser: launchedBrowser, page } = await setupPuppeteer();
    browser = launchedBrowser;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const data = await page.evaluate(async (url) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const currentPriceText = document.querySelector('.product-new-price')?.textContent?.trim() || '';
      const currentPrice = (currentPriceText.replace(/[^\d.-]/g, '')) || '0';
      const available = (currentPrice != '0' && !!currentPrice);

      function processPriceEmag(priceText: string) {
        priceText = priceText.replace(/\./g, '');
        const priceLei = priceText.slice(0, -2);
        const priceBani = priceText.slice(-2);
        return Number(`${priceLei}.${priceBani}`);
      }

      const processedCurrentPrice = processPriceEmag(currentPrice);

      return {price: processedCurrentPrice, available};
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