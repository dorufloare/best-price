import { getAllProducts, updateProduct } from '@/lib/actions/product.actions';
import { scrapeData, scrapePrice } from '@/lib/scaper/scraper';
import { NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey || apiKey !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await getAllProducts()
    products.forEach(async(product: ProductData) => {
      if (!product?._id)
        return;

      const productUrl = product.url;
      const scrapedData = await scrapePrice(productUrl);
      let available = false;
      let newPrice = 0;
      if (scrapedData?.available) {
        available = true;
        newPrice = scrapedData.price;
      }
      product.priceHistory.push(newPrice);
      product.available = available;
      updateProduct(product._id, product);
    });
    return NextResponse.json({ error: 'Products updated!' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
