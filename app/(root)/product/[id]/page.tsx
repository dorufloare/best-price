"use client";

import { getProductById } from '@/lib/actions/product.actions';
import { getCurrentPrice } from '@/lib/product.utils';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductPage: React.FC = () => {
  const { userId } = useAuth();
  const params = useParams();
  const productId = params?.id as string | undefined;

  const [product, setProduct] = useState<ProductData>();

  const fetchProductData = async () => {
    try {
      if (productId) {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
      }
    } catch (error) {
      console.log('Error fetching product data');
    }
  };

  useEffect(() => {
    if (!userId) redirect('/sign-in');
    fetchProductData();
  }, []);

  if (!product || !productId) return <p>Loading...</p>;

  return (
    <div className="mx-[16%] mt-16 h-screen">
      <div className="flex flex-row gap-16 h-full">
        <div className="flex justify-center">
          <div className="relative w-[400px] h-[400px] overflow-hidden bg-gray-200"> 
            <Image
              src={product.imageUrl}
              alt="product image"
              layout="fill" 
              objectFit="cover" 
              objectPosition="center" 
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 sm:text-md text-left mt-7">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-gray-900 mt-16 ml-10">
            {product.available ? getCurrentPrice(product) + ' ' + product.currency : 'Out of stock'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
