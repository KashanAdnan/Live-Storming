const express = require("express");
const OfferControler = require("../Controllers/Offer.Controller.js");
const {
  isAuthenticateUser,
  authorizeRole,
} = require("../Middleware/Authentication.js");
const OfferRoute = express.Router();

const multer = require("multer");
const path = require("path");

OfferRoute.use(express.static("Public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../Public/OfferImages"),
      function (err, succes) {
        if (err) throw err;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, (err, succes) => {
      if (err) throw err;
    });
  },
});
var upload = multer({ storage: storage });

OfferRoute.get("/Offers", isAuthenticateUser, OfferControler.getAllOffers);

OfferRoute.post(
  "/admin/Offers/new",
  isAuthenticateUser,
  upload.single("image"),
  authorizeRole("admin"),
  OfferControler.CreateOffer
);
OfferRoute.put(
  "/admin/Offer/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  OfferControler.UpdateOffer
);
OfferRoute.delete(
  "/admin/Offer/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  OfferControler.deleteOffer
);
OfferRoute.put("/review", isAuthenticateUser, OfferControler.createRating);
OfferRoute.get("/Offer/:id", OfferControler.getOfferDetails);
OfferRoute.get("/reviews", OfferControler.getAllReveiws);
OfferRoute.delete(
  "/reviewsDelete",
  isAuthenticateUser,
  OfferControler.deleteReviews
);

module.exports = OfferRoute;
