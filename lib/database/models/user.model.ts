import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  completedPayment: {
    type: Boolean,
    required: true,
  },
  products: {
    type: [String], 
  },
}) ;

export default models.User || model("User", UserSchema);