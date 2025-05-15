import moongoose from "mongoose";

const furnitureSchema = new moongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "used", "damaged"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["available", "sold", "blocked"],
      default: "available",
    },
    owner: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default moongoose.model("Furniture", furnitureSchema);
