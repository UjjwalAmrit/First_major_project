const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isAuthor , validateReview } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

// reviews form - crud operations

	//post route

	router.post("/",isLoggedIn, validateReview, wrapAsync(reviewControllers.postReview));
	
	// delete review route

	router.delete("/:reviewId",isLoggedIn , isAuthor, wrapAsync(reviewControllers.deleteReview));

	module.exports = router;