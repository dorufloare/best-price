"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";

export async function createUser(user: {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
}) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again.");
  }
}

//gets user by CLERK ID
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw new Error("Failed to fetch user. Please try again.");
  }
}

export async function getAllUsers() {
  try {
    await connectToDatabase();

    const users = await User.find({}); // Fetch all users

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users. Please try again.");
  }
}

export async function updateUser(clerkId: string, user: {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
}) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error(`Failed to update user with ID ${clerkId}`);

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error(`Error updating user with ID ${clerkId}:`, error);
    throw new Error("Failed to update user. Please try again.");
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error(`User with ID ${clerkId} not found`);
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.error(`Error deleting user with ID ${clerkId}:`, error);
    throw new Error("Failed to delete user. Please try again.");
  }
}

export async function addProductToUser(clerkId: string, productId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error(`User with ID ${clerkId} not found`);
    }

    if (!user.products.includes(productId)) {
      user.products.push(productId);
      console.log("Prod", productId, 'added to', user);
      await user.save(); 
    } else {
      console.log(`Product with ID ${productId} is already associated with user ${clerkId}`);
    }

  } catch (error) {
    console.error(`Error adding product to user with ID ${clerkId}:`, error);
    throw new Error("Failed to add product to user. Please try again.");
  }
}

export async function removeProductFromUser(clerkId: string, productId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error(`User with ID ${clerkId} not found`);
    }

    const productIndex = user.products.indexOf(productId);

    if (productIndex > -1) {
      user.products.splice(productIndex, 1);
      console.log("Product", productId, 'removed from', user);
      await user.save(); 
    } else {
      console.log(`Product with ID ${productId} is not associated with user ${clerkId}`);
    }

  } catch (error) {
    console.error(`Error removing product from user with ID ${clerkId}:`, error);
    throw new Error("Failed to remove product from user. Please try again.");
  }
}
