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

export function getLowestPrice(product: any) {
  if (!product?.priceHistory || product.priceHistory.length === 0) return null;
  return Math.min(...product.priceHistory);
}


export function getHighestPrice(product: any) {
  if (!product?.priceHistory || product.priceHistory.length === 0) return null;
  return Math.max(...product.priceHistory);
}

export function getAveragePrice(product: any) {
  if (!product?.priceHistory || product.priceHistory.length === 0) return null;
  const total = product.priceHistory.reduce((sum: number, price: number) => sum + price, 0);
  return total / product.priceHistory.length;
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

export const loadProductsFromCache =  () => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : null;
};

export const addProductToCache = (newProduct: ProductData) => {
  const products = loadProductsFromCache() || [];
  const productExists = products.some((product : ProductData) => product._id === newProduct._id);

  if (!productExists) {
    const updatedProducts = [...products, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  }
};
