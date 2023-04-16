const OfferModel = require("../Models/Offer.Model");
const ErrorHandler = require("../Utils/Error.Handler");
const catchAsyncError = require("../Middleware/catch.Async.error");
const Apifeatures = require("../Utils/Api.Features");
// Creating Offers
const CreateOffer = catchAsyncError(async (req, res, next) => {
  if (req.user.is_verified === 1) {
    req.body.user = req.user.id;
    const {
      name,
      description,
      price,
      offer,
      rating,
      category,
      Stock,
      numOfReviews,
      user,
    } = req.body;
    const Offer = await OfferModel.create({
      creator: req.user._id,
      name,
      description,
      price,
      offer,
      rating,
      image: req.file.filename,
      category,
      Stock,
      numOfReviews,
      user,
    });
    res.status(201).json({
      success: true,
      Offer,
    });
  }
});
//Getting all Offers
const getAllOffers = async (req, res, next) => {
  if (req.user.is_verified === 1) {
    const resultPage = 5;
    const OfferCount = await OfferModel.countDocuments();

    const apiFeatures = new Apifeatures(OfferModel.find(), req.query)
      .search()
      .filter()
      .pagination(resultPage);
    const Offers = await apiFeatures.query;
    res.status(200).send({
      sucess: true,
      Offers,
      OfferCount,
    });
  } else {
    return next(new ErrorHandler("Please Verify Your Mail to See Offers", 404));
  }
};
// Updating the Offers
const UpdateOffer = catchAsyncError(async (req, res, next) => {
  let Offer = OfferModel.findById(req.params.id);
  if (!Offer) {
    return next(new ErrorHandler("Offer Not Found", 404));
  }
  Offer = await OfferModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    Offer,
  });
});
//Delting the Offers
const deleteOffer = catchAsyncError(async (req, res, next) => {
  const Offer = await OfferModel.findById(req.params.id);
  if (!Offer) {
    return next(new ErrorHandler("Offer Not Found", 404));
  }
  await Offer.remove();
  res.status(200).json({
    success: true,
    msg: "Offer successfully Deleted",
  });
});
//Getting Signle Offer Details
const getOfferDetails = catchAsyncError(async (req, res, next) => {
  let Offer = await OfferModel.findById(req.params.id);
  if (!Offer) {
    return next(new ErrorHandler("Offer Not Found", 404));
  }
  res.status(200).send({
    success: true,
    Offer,
  });
});
const createRating = catchAsyncError(async (req, res, next) => {
  const { rating, comment, OfferId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const Offer = await OfferModel.findById(OfferId);
  const isReviewed = Offer.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    Offer.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) rev.rating = rating;
      rev.comment = comment;
    });
  } else {
    Offer.reviews.push(review);
    Offer.numOfReviews = Offer.reviews.length;
  }
  let avg = 0;
  Offer.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  Offer.ratings = avg / Offer.reviews.length;
  await Offer.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// get All reviews
const getAllReveiws = catchAsyncError(async (req, res, next) => {
  const Offer = await OfferModel.findById(req.query.id);
  if (!Offer) {
    return next(new ErrorHandler("Offer Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: Offer.reviews,
  });
});
const deleteReviews = catchAsyncError(async (req, res, next) => {
  const Offer = await OfferModel.findById(req.query.OfferId);
  if (!Offer) {
    return next(new ErrorHandler("Offer Not Found", 404));
  }
  const reviews = Offer.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = (Offer.ratings = avg / Offer.reviews.length);
  const numOfReviews = reviews.length;
  await OfferModel.findByIdAndUpdate(
    req.query.OfferId,
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
  CreateOffer,
  getAllOffers,
  UpdateOffer,
  deleteOffer,
  getOfferDetails,
  createRating,
  getAllReveiws,
  deleteReviews,
};
