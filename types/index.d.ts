declare type ProductData = {
  _id?: string,
  name: string,
  url: string,
  available: boolean,
  priceHistory: number[],
  currency: string,
  imageUrl: string,

};

declare type UserData = {
  _id?: string,
  clerkId: string,
  email: string,
  username: string,
  photo: string,
  firstName: string,
  lastName: string,
  completedPayment: string,
  products: string[] 
}