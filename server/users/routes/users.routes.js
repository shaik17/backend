const express = require("express");

const router = express.Router();
const userControl = require("../controllers/users.controller");
const user = require("../../middleware/validators/user.validator");
const userAccessControl = require("../controllers/userAccess.controller");
const error = require("../../middleware/validators/error.validator");
const verifyToken = require("../../middleware/verifyRefreshToken.middleware");

// router.route("/").get(userControl.getUsers);

// router
//   .route("/:userId")
//   .get(
//     user.validate("GetByUserID"),
//     error.check(),
//     userControl.getUserByUserId
//   );

router
  .route("/")
  .post(user.validate("CreateUser"), error.check(), userControl.createUser);

// router
//   .route("/onboard/visitors")
//   .post(user.validate("CreateUser"), error.check(), userControl.createVisitors);

// router
//   .route("/onboard/doctors")
//   .post(user.validate("CreateUser"), error.check(), userControl.createDoctors);

// router
//   .route("/auth")
//   .post(user.validate("ConsumerAuth"), error.check(), userControl.login);

// router
//   .route("/auth/refreshToken")
//   .post(
//     verifyToken.refreshToken(),
//     user.validate("RefreshToken"),
//     error.check(),
//     userControl.refreshToken
//   );

// router
//   .route("/:userId")
//   .delete(user.validate("DeleteUsers"), error.check(), userControl.deleteUser);

// router
//   .route("/:userId")
//   .patch(user.validate("PatchUsers"), error.check(), userControl.updateUser);

// router.route("/password/forgot").post(userControl.forgotPassword);

// router.route("/password/reset").patch(userControl.resetPassword);

// router.route("/password/update").patch(userControl.updatePassword);

// router.route("/access/logout").patch(userAccessControl.logout);

// router.route("/verification/email").get(userControl.resendEmail);

// router.route("/verify/account").post(userControl.accountVerify);

module.exports = router;
