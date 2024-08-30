import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String
  },
  url: {
    type: String,
  },
  available: {
    type: Boolean,
  },
  priceHistory: {
    type: [Number],
  },
  currency: {
    type: String,
  },
  imageUrl: {
    type: String,
  }
});

export default models.Product || model("Product", ProductSchema);