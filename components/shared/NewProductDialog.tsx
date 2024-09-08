"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProductToCache, checkUrl } from '@/lib/product.utils';
import { createProduct, getAllProducts, getProductById, getProductIdByUrl } from '@/lib/actions/product.actions';
import { scrapeData } from '@/lib/scaper/scraper';
import { addProductToUser, getUserById, updateUser } from '@/lib/actions/user.actions';
import { useAuth } from '@clerk/nextjs';

interface Props {
  products: ProductData[];
  setProducts: React.Dispatch<React.SetStateAction<ProductData[]>>;
  fetchProducts: () => Promise<void>;
  user: UserData | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}

const NewProductDialog: React.FC<Props> = ({ products, setProducts, fetchProducts, user, setUser}) => {
  const { userId } = useAuth();
  const [productUrl, setProductUrl] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');
    setIsLoading(true);

    const urlCheckerMessage = checkUrl(productUrl);

    if (urlCheckerMessage !== "ok") {
      setFormErrorMessage(urlCheckerMessage);
      setIsLoading(false);
      return;
    }

    try {
      //Check if the product already exists in the database

      const productWithUrl = await getProductIdByUrl(productUrl);
      let newProduct: (ProductData | null) = null;

      if (!productWithUrl) {
        const scrapedProduct = await scrapeData(productUrl);

        if (!scrapedProduct) {
          setFormErrorMessage('* failed to add new product. Please contact us.');
          setIsLoading(false);
          return;
        }

        newProduct = await createProduct(scrapedProduct);
      } else {
        newProduct = await getProductById(productWithUrl);
      }

      //Check if the product is already associated to the user
     
      if (!user || !newProduct || !newProduct._id) return;

      if (user.products.find((productId) => productId === newProduct._id)) {
        setFormErrorMessage('* This product has already been added into your collection');
        setIsLoading(false);
        return;
      }

      //Add the product to the user
      const updatedUser: UserData = {
        ...user,
        products: [...user.products, newProduct._id],
      };

      console.log("WILL ADD PRODUCT");
      await addProductToUser(user.clerkId, newProduct._id);
      setUser(updatedUser);

      setFormErrorMessage('');
      setProductUrl('');
      setOpen(false);
      addProductToCache(newProduct);
      await fetchProducts();
    } catch (error) {
      console.error("Error during submission:", error);
      setFormErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) return null; 

  return (
    <div className='w-1/2 flex justify-center cursor-pointer xl:w-1/4'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Image
            height={200}
            width={200}
            src='/assets/images/plus.png'
            alt='add new product'
            className='object-contain'
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New product</DialogTitle>
            <DialogDescription>
              Enter the URL of the product
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="col-span-3"
                />
                <p className='text-left col-start-2 col-span-3 text-red-600 text-xs'> {formErrorMessage} </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Adding product...' : 'Add product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewProductDialog;
