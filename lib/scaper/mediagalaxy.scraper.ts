import puppeteer, { Browser, Page } from "puppeteer";
import { setupPuppeteer } from "./scraper";
import { urlToUrlWithoutFlightMarker } from "next/dist/client/components/app-router";

export async function scrapeMediagalaxyProduct(url: string) {
	if (!url) return;

	let browser: Browser | null = null;

	try {
		const { browser: launchedBrowser, page } = await setupPuppeteer();
		browser = launchedBrowser;

		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

		const data = await page.evaluate(async (url) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const title = document.querySelector('h1')?.textContent?.trim() || '';
			const currentPrice = document.querySelector('.Price-int.leading-none')?.textContent || '0'
			const currentBani = document.querySelector('sup.inline-block.-tracking-0\\.33')?.textContent || '0';
			const available = (currentPrice != '0' && !!currentPrice);
			const image = document.querySelector('.swiper-zoom-container img')?.getAttribute('src') || '';

			function processMediagalaxyPrice() {
				const lei = parseFloat(currentPrice.replace(/[^0-9]+/g, '')) || 0;
				const bani = parseFloat(currentBani.replace(/[^0-9]+/g, '')) || 0;
				const total = lei + bani / 100;
				return total;
			}

			const processedCurrentPrice = processMediagalaxyPrice();

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

export async function scrapeMediagalaxyPrice(url: string) {
	if (!url) return;

	let browser: Browser | null = null;

	try {
		const { browser: launchedBrowser, page } = await setupPuppeteer();
		browser = launchedBrowser;

		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

		const data = await page.evaluate(async (url) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			
			const currentPrice = document.querySelector('span > span.Price-int.leading-none')?.textContent || '0'
			const currentBani = document.querySelector('span > sup.inline-block.-tracking-0\\.33')?.textContent || '0';
			const available = (currentPrice != '0' && !!currentPrice);

			function processMediagalaxyPrice() {
				const lei = parseFloat(currentPrice.replace(/[^0-9]+/g, '')) || 0;
				const bani = parseFloat(currentBani.replace(/[^0-9]+/g, '')) || 0;
				const total = lei + bani / 100;
				return total;
			}

			const processedCurrentPrice = processMediagalaxyPrice();

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