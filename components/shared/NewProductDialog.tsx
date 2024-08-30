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
import { checkUrl } from '@/lib/product.utils';
import { createProduct, getAllProducts, getProductIdByUrl } from '@/lib/actions/product.actions';
import { scrapeData } from '@/lib/scaper/scraper';
import { getUserById } from '@/lib/actions/user.actions';
import { useAuth } from '@clerk/nextjs';

interface Props {
  products: ProductData[];
  setProducts: React.Dispatch<React.SetStateAction<ProductData[]>>;
}

const NewProductDialog: React.FC<Props> = ({ products, setProducts }) => {
  const { userId } = useAuth();
  const [productUrl, setProductUrl] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchProducts();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;

    try {
      const fetchedUser = await getUserById(userId);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

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
      const productWithUrl = await getProductIdByUrl(productUrl);

      if (!productWithUrl) {
        const scrapedProduct = await scrapeData(productUrl);

        if (!scrapedProduct) {
          setFormErrorMessage('* failed to add new product. Please contact us.');
          setIsLoading(false);
          return;
        }

        await createProduct(scrapedProduct);
      } else {
        const existingProduct = products.find((product) => product._id === productWithUrl);

        if (existingProduct) {
          setFormErrorMessage('* This product has already been added into your collection');
          setIsLoading(false);
          return;
        }
      }

      setFormErrorMessage('');
      setProductUrl('');
      setOpen(false);
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
    <div className='w-1/4 flex justify-center cursor-pointer'>
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
