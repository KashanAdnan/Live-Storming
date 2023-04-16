const ErroHandler = require("../Utils/Error.Handler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid ${err.path}`;
    err = new ErroHandler(message, 400);
  }
  // Monogoose Dupluia
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered `;
    err = new ErroHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid try again`;
    err = new ErroHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expire try again`;
    err = new ErroHandler(message, 400);
  }

  res.status(err.statusCode).send({
    succss: false,
    message: err.message,
  });
};
