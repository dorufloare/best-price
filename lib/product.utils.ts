export function getCurrentPrice(product: any) {
  if (!product?.priceHistory)
    return null;

  if (product.priceHistory.length === 0)
    return null;

  return product.priceHistory[product.priceHistory.length - 1];
}

export function getUrlSource(url: string) {
  const sources = [
    { domain: 'emag', source: 'emag' },
    { domain: 'altex', source: 'altex' },
    { domain: 'mediagalaxy', source: 'mediagalaxy' },
    { domain: 'cel', source: 'cel' },
    { domain: 'nike', source: 'nike' },

  ];

  for (const { domain, source } of sources) {
    if (url.includes(domain)) {
      return source;
    }
  }
  
  return null;
}

export function getLowestPrice(product: any, nrDays?: number) {
  if (!product?.priceHistory || product.priceHistory.length === 0) return null;

  const daysToConsider = nrDays !== undefined
    ? Math.min(nrDays, product.priceHistory.length)
    : product.priceHistory.length;

  const recentPrices = product.priceHistory.slice(-daysToConsider);

  return Math.min(...recentPrices);
}

export function getHighestPrice(product: any, nrDays?: number) {
  if (!product?.priceHistory || product.priceHistory.length === 0) return null;

  const daysToConsider = nrDays !== undefined
    ? Math.min(nrDays, product.priceHistory.length)
    : product.priceHistory.length;


  const recentPrices = product.priceHistory.slice(-daysToConsider);

  return Math.max(...recentPrices);
}

export function getAveragePrice(product: any, nrDays?: number) {
  if (!product?.priceHistory || product.priceHistory.length === 0) return null;

  const daysToConsider = nrDays !== undefined
    ? Math.min(nrDays, product.priceHistory.length)
    : product.priceHistory.length;

  const recentPrices = product.priceHistory.slice(-daysToConsider);

  const total = recentPrices.reduce((sum: number, price: number) => sum + price, 0);
  return total / recentPrices.length;
}

const validUrl = require('valid-url');

export function checkUrl(url: string) {
  if (!url)
    return "* URL cannot be empty";

  if (!validUrl.isUri(url))
    return "* Please enter a valid URL";

  if (!getUrlSource(url))
    return "* This store is not yet supported. Please contact us if you'd like us to add it!"

  return "ok";

}

export function getPriceDescription(product: ProductData, nrDays?: number) {
  const daysToConsider = (nrDays === undefined ? product.priceHistory.length : nrDays);

  const averagePrice = getAveragePrice(product, daysToConsider);
  const lowestPrice = getLowestPrice(product, daysToConsider);
  const highestPrice = getHighestPrice(product, daysToConsider);
  const currentPrice = getCurrentPrice(product);

  if (!product?.priceHistory.length || !lowestPrice || !highestPrice || !averagePrice || !currentPrice)
    return '';

  if (currentPrice == averagePrice)
    return 'average price';
  else if (currentPrice <= lowestPrice)
    return 'very low price!';
  else if (currentPrice >= highestPrice)
    return 'very high price';
  else if (currentPrice < averagePrice)
    return 'lower than average price';
  else if (currentPrice > averagePrice)
    return 'higher than average price';
  return '';
}

export function checkPriceDrop(product: ProductData): boolean {
  const priceHistory = product.priceHistory;

  if (priceHistory.length < 2) {
    return false;
  }

  const lastPrice = priceHistory[priceHistory.length - 1];
  const secondToLastPrice = priceHistory[priceHistory.length - 2];

  return lastPrice < secondToLastPrice;
}
