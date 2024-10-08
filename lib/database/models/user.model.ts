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
    default: true,
  },
  products: {
    type: [String],
    default: [], 
  },
}) ;

export default models.User || model("User", UserSchema);