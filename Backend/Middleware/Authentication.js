const ErrorHandler = require("../Utils/Error.Handler");
const catchAsyncError = require("./catch.Async.error");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Models/User.Model");
const config = require("../Config/config");

exports.isAuthenticateUser = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.Token;
  if (!token) {
    return next(new ErrorHandler("Please Login To Acess This Resource", 401));
  }
  const decodedData = jwt.verify(token, config.JWTsecret);
  req.user = await UserModel.findById(decodedData.id);

  next();
});

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not Allowed to use this resource`,
          400
        )
      );
    }
    next();
  };
};
