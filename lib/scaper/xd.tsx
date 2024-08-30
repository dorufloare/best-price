"use client"


export function scrapeEmagData() {
  console.log('Evaluating page content...');
  const title = document.querySelector('.page-title')?.textContent?.trim() || '';
  const currentPriceText = document.querySelector('.product-new-price')?.textContent?.trim() || '';
  const originalPriceText = document.querySelector('.product-new-price.has-deal')?.textContent?.trim() || currentPriceText;
  const currentPrice = (currentPriceText.replace(/[^\d.-]/g, '')) || '0';
  const originalPrice = (originalPriceText.replace(/[^\d.-]/g, '')) || currentPrice;
  const outOfStock = currentPrice == '0' || !currentPrice;
  const image = document.querySelector('.product-gallery-image img')?.getAttribute('src') || '';


  //we need this function inside the browser page, we cannot import it from utils
  function processPriceEmag(priceText: string) {
    priceText = priceText.replace(/\./g, '');
    const priceLei = priceText.slice(0, -2);
    const priceBani = priceText.slice(-2);
    return Number(`${priceLei}.${priceBani}`);
  }

  const processedCurrentPrice = processPriceEmag(currentPrice);
  const processedOriginalPrice = processPriceEmag(originalPrice);

  console.log("----------SCRAPED DATA---------------");
  console.log(processedCurrentPrice);
  console.log(title);
}
