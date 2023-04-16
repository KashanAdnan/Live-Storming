const express = require("express");
const app = express();
const UserRoute = require("./Routes/User.Route");
const colors = require("colors");
const config = require("./Config/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const conectDataBase = require("./Database/Connection.DB.js");
const ErrorMiddleware = require("./Middleware/Error");
const cookieParser = require("cookie-parser");
const ProductRoute = require("./Routes/Product.Route");
const OfferRoute = require("./Routes/Offer.Route");
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`.red);
  console.log(`Shutting down the server due to Unhandled Promise Exeption`.red);
  server.close(() => {
    process.exit(1);
  });
});

app.use(bodyParser.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
conectDataBase("mongodb://localhost:27017/Animal");
app.use("/api", UserRoute);
app.use("/api", ProductRoute);
app.use("/api", OfferRoute);
app.use(ErrorMiddleware);

var server = app.listen(config.PORT, () => {
  console.log(`Server is Listing on Port ${config.PORT}`.yellow);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`.red);
  server.close(() => {
    process.exit(1);
  });
});
