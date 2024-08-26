"use server"

import { revalidatePath } from "next/cache";

import Product from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";

export async function createProduct(product: ProductData) {
  try {
    await connectToDatabase();

    const newProduct = await Product.create(product);
    
    return JSON.parse(JSON.stringify(newProduct));
  } catch(error) {
    console.log(error);
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDatabase();

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error(`Could not fetch product with ID: ${productId}`);
  }
}

export async function updateProduct(productId: string, product: ProductData) {
  try {
    await connectToDatabase();

    const updatedProduct = await Product.findOneAndUpdate(
      {_id: productId},
      product,
      {new: true}
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error(`Could not fetch product with ID: ${productId}`);
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectToDatabase();

    const productToDelete = Product.findById(productId);

    if (!productToDelete) {
      throw new Error('Product not found');
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    revalidatePath("/");
    
    return deleteProduct ? JSON.parse(JSON.stringify(deleteProduct)) : null;
    
  } catch(error) {
    console.error('Error fetching product by ID:', error);
    throw new Error(`Could not fetch product with ID: ${productId}`);
  }
}