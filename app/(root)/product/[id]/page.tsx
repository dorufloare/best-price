"use client";

import PriceChart from '@/components/shared/PriceChart';
import { getProductById } from '@/lib/actions/product.actions';
import { getAveragePrice, getCurrentPrice, getHighestPrice, getLowestPrice } from '@/lib/product.utils';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductPage: React.FC = () => {
  const { userId } = useAuth();
  const params = useParams();
  const productId = params?.id as string | undefined;

  const [product, setProduct] = useState<ProductData>();
  let priceDescription: string = '';


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
    <div className="mx-[5%] md:mx-[10%] lg:mx-[16%] mt-2 md:mt-8 lg:mt-16 h-screen">
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-16 h-full w-full">
        <div className="flex justify-center h-[20rem] md:h-[100rem] lg:h-auto lg:w-[40%]">
          <div className="relative w-full h-[15rem] md:h-[30rem] lg:h-auto overflow-hidden mt-4 lg:mt-32 items-start "> 
            <Image
              src={product.imageUrl}
              alt="product image"
              layout="fill" 
              objectFit="contain" 
              objectPosition="top" 
            />
          </div>
        </div>
        <div className='lg:w-[50%]'>
          <div className='lg:ml-6'>
            <h3 className="text-xs md:text-lg lg:text-lg font-semibold text-gray-900 text-left lg:mt-7">
              {product.name}
            </h3>
            <p className='text-xs md:text-sm lg:text-sm text-blue-800 underline mt-3 md:tracking-wide mb-5'>
              <a href={product.url}>
                Visit product
              </a>
            </p>
          </div>
         <PriceChart product={product}/>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
