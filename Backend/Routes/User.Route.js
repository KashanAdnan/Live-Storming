const express = require("express");
const UserControler = require("../Controllers/User.Controller.js");
const multer = require("multer");
const path = require("path");
const {
  isAuthenticateUser,
  authorizeRole,
} = require("../Middleware/Authentication.js");
const UserRoute = express.Router();

UserRoute.use(express.static("Public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Public/Images"), function (err, succes) {
      if (err) throw err;
    });
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, (err, succes) => {
      if (err) throw err;
    });
  },
});
var upload = multer({ storage: storage });

UserRoute.post("/register", upload.single("image"), UserControler.registerUser);
UserRoute.post("/login", UserControler.loginUser);
UserRoute.post("/password/forgot", UserControler.forgetPassword);
UserRoute.put("/password/reset/:token", UserControler.resetPassword);
UserRoute.get("/logout", UserControler.Logout);
UserRoute.get("/verify", UserControler.verifyMail);
UserRoute.get("/me", isAuthenticateUser, UserControler.getUserDeteails);
UserRoute.put(
  "/password/update",
  isAuthenticateUser,
  UserControler.updatePassword
);
UserRoute.put("/me/update", isAuthenticateUser, UserControler.updateUser);
UserRoute.get(
  "/admin/user/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  UserControler.getSingleUser
);
UserRoute.get(
  "/admin/users",
  isAuthenticateUser,
  authorizeRole("admin"),
  UserControler.getAllUsers
);
UserRoute.delete(
  "/admin/user/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  UserControler.DeleteUser
);
UserRoute.put(
  "/admin/user/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  UserControler.updateRole
);
module.exports = UserRoute;
