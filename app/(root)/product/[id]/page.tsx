"use client";

import PriceChart from '@/components/shared/PriceChart';
import { getProductById } from '@/lib/actions/product.actions';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { getUserById, removeProductFromUser } from '@/lib/actions/user.actions';
import { removeProductFromCache } from '@/lib/cache.utils';

const ProductPage: React.FC = () => {
  const { userId } = useAuth();
  const params = useParams();
  const productId = params?.id as string | undefined;
  const router = useRouter();
  const [product, setProduct] = useState<ProductData>();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  
  // State for handling image URL and fallback
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  const fetchProductData = async () => {
    try {
      if (productId) {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
        setImgSrc(fetchedProduct.imageUrl); // Set initial image URL
      }
    } catch (error) {
      console.log('Error fetching product data');
    }
  };

  const fetchUser = async () => {
    try {
      if (!userId) return;
      const fetchedUser = await getUserById(userId);
      setUser(fetchedUser);
    } catch (error) {
      console.log('Error fetching user');
    }
  };

  const handleDelete = () => {
    if (!product?._id || !userId) return;
    
    removeProductFromUser(userId, product._id);
    removeProductFromCache(product._id);

    setOpen(false);
    router.push('/dashboard');
  };

  // Handle image error and set fallback
  const handleImageError = () => {
    setImgSrc('/assets/images/placeholder.jpg');
  };

  useEffect(() => {
    if (!userId) redirect('/sign-in');
    fetchUser();
    fetchProductData();
  }, [userId, productId]);

  if (!product || !productId) return <p>Loading...</p>;
  if (!user || !user.products || !user.products.includes(productId)) return <p>Unauthorized</p>;

  return (
    <div className="mx-[5%] md:mx-[10%] lg:mx-[16%] mt-2 md:mt-8 lg:mt-16 h-screen">
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-16 w-full">
        <div className="flex justify-center h-[20rem] md:h-[100rem] lg:h-auto lg:w-[40%]">
          <div className="relative w-full h-[15rem] md:h-[30rem] lg:h-auto overflow-hidden mt-4 lg:mt-32 items-start"> 
            <Image
              src={imgSrc || '/assets/images/placeholder.jpg'}  // Use imgSrc for dynamic handling
              alt="product image"
              layout="fill"
              objectFit="contain"
              objectPosition="top"
              onError={handleImageError}  // Handle image load failure
            />
          </div>
        </div>
        <div className='lg:w-[50%]'>
          <div className='lg:ml-6'>
            <h3 className="text-xs md:text-lg lg:text-lg font-semibold text-gray-900 text-left lg:mt-7">
              {product.name}
            </h3>
            <p className='text-xs md:text-sm lg:text-sm text-blue-800 underline mt-3 md:tracking-wide mb-5'>
              <a href={product.url}>Visit product</a>
            </p>
          </div>
          <PriceChart product={product} />
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
          <DialogFooter>
            <Button onClick={handleDelete}>Yes</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className='text-xs md:text-sm lg:text-base text-red-500 mt-10'>
        Not interested anymore? <span className='ml-2 underline cursor-pointer' onClick={() => setOpen(true)}>Remove this product from your dashboard</span>
      </p>
    </div>
  );
};

export default ProductPage;
