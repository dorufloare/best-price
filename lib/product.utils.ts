export function getCurrentPrice(product: any) {
  if (!product?.priceHistory)
    return null;

  if (product.priceHistory.length === 0)
    return null;

  return product.priceHistory[0];
}

export function getUrlSource(url: string) {
  if (url.includes("emag")) {
    return "emag";
  }
  return null;
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