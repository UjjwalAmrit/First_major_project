const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

router.get("/signup" ,userControllers.signup);

router.post("/signup", wrapAsync(userControllers.signupForm));

router.get("/login" , userControllers.login);

router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect : "/login" , failureFlash : true ,}) , wrapAsync(userControllers.loginForm));

router.get("/logout", userControllers.logout);

module.exports = router;