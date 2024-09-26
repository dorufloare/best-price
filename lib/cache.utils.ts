export const loadProductsFromCache = () => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : null;
};

export const addProductToCache = (newProduct: ProductData) => {
  const products = loadProductsFromCache() || [];
  const productExists = products.some((product: ProductData) => product._id === newProduct._id);

  if (!productExists) {
    const updatedProducts = [...products, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  }
};

export const removeProductFromCache = (productId: string) => {
  const products = loadProductsFromCache() || [];
  const updatedProducts = products.filter((product: ProductData) => product._id !== productId);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

export const clearProductsCacheIfExpired = () => {
  const lastClearDateStr = localStorage.getItem('lastClearDate');
  const lastClearDate = lastClearDateStr ? new Date(lastClearDateStr) : null;

  const now = new Date();
  const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  if (!lastClearDate || (now.getTime() - lastClearDate.getTime()) > sixHours) {
    localStorage.removeItem('products'); // Clear products
    localStorage.setItem('lastClearDate', now.toISOString()); // Update last clear date
  }
};
