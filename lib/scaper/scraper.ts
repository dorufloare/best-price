"use server"
import { getUrlSource } from "../product.utils";
import { scrapeEmagProduct } from "./emag.scraper";

import puppeteer, { Browser, Page } from "puppeteer";

export async function setupPuppeteer() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('Page error:', error.message));

  return { browser, page };
}

export async function scrapeData(url: string) {
  const source = getUrlSource(url);

  if (!source) return null;

  let scrapedData = null;
  if (source == 'emag') {
    scrapedData = await scrapeEmagProduct(url);
  }

  return scrapedData;
}
