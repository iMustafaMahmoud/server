const express = require("express");

const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();
//const fileUpload = require("../middlewares/file-upload");

router.get("/", userController.getUsers);

router.get("/:uid", userController.getUserById);

router.post(
  "/signup",
  [
    check("first_name").not().isEmpty(),
    check("last_name").not().isEmpty(),
    check("email")
      .normalizeEmail() //Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
    check("confirm_password").isLength({ min: 6 }),
    check("date_of_birth").not().isEmpty(),
    check("gender").not().isEmpty(),
  ],
  userController.signup
);

router.post("/login", userController.login);

router.patch(
  "/:uid",
  check("name").not().isEmpty(),
  check("email")
    .normalizeEmail() //Test@test.com => test@test.com
    .isEmail(),
  check("password").isLength({ min: 6 }),
  userController.updateUser
);

router.delete("/:uid", userController.deleteUser);

module.exports = router;
