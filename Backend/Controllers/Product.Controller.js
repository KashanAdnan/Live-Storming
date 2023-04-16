const { ProductModel } = require("../Models/Product.Model");
const ErrorHandler = require("../Utils/Error.Handler");
const catchAsyncError = require("../Middleware/catch.Async.error");
const Apifeatures = require("../Utils/Api.Features");
// Creating Product
const CreateProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const { name, description, price, offer, rating, category, Stock } = req.body;
  const product = await ProductModel.create({
    name,
    description,
    price,
    offer,
    rating,
    image: req.file.filename,
    category,
    Stock,
  });
  res.status(201).json({
    success: true,
    product,
  });
});
//Getting all products
const getAllProducts = async (req, res, next) => {
  if (req.user.is_verified === 1) {
    const resultPage = 5;
    const ProductCount = await ProductModel.countDocuments();

    const apiFeatures = new Apifeatures(ProductModel.find(), req.query)
      .search()
      .filter()
      .pagination(resultPage);
    const Products = await apiFeatures.query;
    res.status(200).send({
      sucess: true,
      Products,
      ProductCount,
    });
  } else {
    return next(
      new ErrorHandler("Please Verify Your Mail to See Products", 404)
    );
  }
};
// Updating the Products
const UpdateProduct = catchAsyncError(async (req, res, next) => {
  let product = ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});
//Delting the Products
const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    msg: "Product successfully Deleted",
  });
});
//Getting Signle Product Details
const getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).send({
    success: true,
    product,
  });
});
const createRating = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await ProductModel.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) rev.rating = rating;
      rev.comment = comment;
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// get All reviews
const getAllReveiws = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
const deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = (product.ratings = avg / product.reviews.length);
  const numOfReviews = reviews.length;
  await ProductModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});

module.exports = {
  CreateProduct,
  getAllProducts,
  UpdateProduct,
  deleteProduct,
  getProductDetails,
  createRating,
  getAllReveiws,
  deleteReviews,
};
