"use client"; 

import React, { useState, useEffect } from 'react';
import ProductThumbnail from '@/components/shared/ProductThumbnail';
import { getAllProducts, getProductIdByUrl } from '@/lib/actions/product.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { getCurrentPrice } from '@/lib/product.utils';
import { useAuth } from '@clerk/nextjs'; 
import { useRouter } from 'next/navigation'; 
import NewProductDialog from '@/components/shared/NewProductDialog';

const Dashboard = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    } else {
      const fetchUserAndProducts = async () => {
        const user = await getUserById(userId);

        if (!user) {
          router.push("/dashboard");
        } else {
          const products = await getAllProducts();
          setProducts(products);
        }
      };

      fetchUserAndProducts();
    }
  }, [userId, router]);

  if (!userId) return null; 

  return (
    <>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-3xl text-center mt-7'>
        Your products
      </h1>
      <div className='flex flex-row mx-[20%] flex-wrap mt-20' gap-10>
        <NewProductDialog
          products={products} 
          setProducts={setProducts}
        />
        {
          products.map((product : any) => (
            <div className='w-1/4 flex justify-center cursor-pointer' key={product._id}>
              <ProductThumbnail
                imageUrl={product.imageUrl}
                title={product.name}
                available={product.available}
                price={getCurrentPrice(product) + ' ' + product.currency}
                key={product._id}
              />
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Dashboard;
