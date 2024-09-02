"use client";

import React, { useState, useEffect } from 'react';
import ProductThumbnail from '@/components/shared/ProductThumbnail';
import { getProductById } from '@/lib/actions/product.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { addProductToCache, getCurrentPrice, loadProductsFromCache } from '@/lib/product.utils';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import NewProductDialog from '@/components/shared/NewProductDialog';
import Link from 'next/link';

const Dashboard = () => {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [user, setUser] = useState<UserData | undefined>(undefined);
  const [isUserFetched, setIsUserFetched] = useState(false);

  const fetchUser = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    try {
      const fetchedUser = await getUserById(userId);
      if (!fetchedUser) {
        router.push("/sign-in");
        return;
      }
      setUser(fetchedUser);
      setIsUserFetched(true); 
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/sign-in");
    }
  };

  const fetchProducts = async () => {
    let fetchedProducts: ProductData[] = [];

    const cachedProducts = loadProductsFromCache();
    if (cachedProducts && cachedProducts.length > 0) {
      fetchedProducts = cachedProducts;
    } else {
      const fetchedProductIds = user?.products || [];
      if (!fetchedProductIds.length) return;

      try {
        const productPromises = fetchedProductIds.map((productId) => getProductById(productId));
        fetchedProducts = await Promise.all(productPromises);

        fetchedProducts.forEach((product) => {
          addProductToCache(product);
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    setProducts(fetchedProducts);
  };

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/sign-in");
        localStorage.clear();
      } else {
        fetchUser();
      }
    }
  }, [isSignedIn, isLoaded, userId, router]);


  useEffect(() => {
    if (isUserFetched) {
      fetchProducts();
    }
  }, [isUserFetched]);

  if (!isLoaded || !user) return null;

  return (
    <>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-3xl text-center mt-7'>
        Your products
      </h1>
      <div className='flex flex-row mx-[5%] md:mx-[20%] flex-wrap mt-20 sm:gap-0'>
        <NewProductDialog
          products={products} 
          setProducts={setProducts}
          fetchProducts={fetchProducts}
          user={user}
          setUser={setUser}
        />
        {products.map((product : any) => (
          <div className='w-1/2 flex justify-center cursor-pointer md:w-1/4' key={product._id}>
            <Link href={`/product/${product._id}`}>
              <ProductThumbnail
                imageUrl={product.imageUrl}
                title={product.name}
                available={product.available}
                price={getCurrentPrice(product) + ' ' + product.currency}
                key={product._id}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
