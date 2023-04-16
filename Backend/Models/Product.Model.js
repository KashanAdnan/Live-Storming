const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter The Product Name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter The Product Description"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter The Product Price"],
      maxLenght: [6, "Price conn't exceed 8 characters"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
    },
    Stock: {
      type: Number,
      required: [true, "Please Enter Product Stock"],
      maxLenght: [4, "Stock cann't exceed 4 characters "],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Products", ProductSchema);

module.exports = {
  ProductModel: ProductModel,
};
