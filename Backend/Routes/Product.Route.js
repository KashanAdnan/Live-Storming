const express = require("express");
const ProductControler = require("../Controllers/Product.Controller.js");
const {
  isAuthenticateUser,
  authorizeRole,
} = require("../Middleware/Authentication.js");
const ProductRoute = express.Router();

const multer = require("multer");
const path = require("path");

ProductRoute.use(express.static("Public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../Public/ProductImages"),
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

ProductRoute.get(
  "/products",
  isAuthenticateUser,
  ProductControler.getAllProducts
);

ProductRoute.post(
  "/admin/products/new",
  isAuthenticateUser,
  upload.single("image"),
  authorizeRole("admin"),
  ProductControler.CreateProduct
);
ProductRoute.put(
  "/admin/product/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  ProductControler.UpdateProduct
);
ProductRoute.delete(
  "/admin/product/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  ProductControler.deleteProduct
);
ProductRoute.put("/review", isAuthenticateUser, ProductControler.createRating);
ProductRoute.get("/product/:id", ProductControler.getProductDetails);
ProductRoute.get("/reviews", ProductControler.getAllReveiws);
ProductRoute.delete(
  "/reviewsDelete",
  isAuthenticateUser,
  ProductControler.deleteReviews
);

module.exports = ProductRoute;
