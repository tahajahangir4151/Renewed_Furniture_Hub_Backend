import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
      default: "Shop Now",
    },
    category: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    originalPrice: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
