const express = require("express");

const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();
//const fileUpload = require("../middlewares/file-upload");

router.get("/", userController.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() //Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
    check("age").not().isEmpty(),
    check("gender").not().isEmpty(),
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
