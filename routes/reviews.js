const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/expressError');

const Campground = require('../models/campground');
const reviews = require('../controllers/reviews');
const Review = require('../models/review');
const { isLoggedIn, isReviewAuthor } = require('../middleware');

const { validateCampground, validateReview } = require('../middleware/schema');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);
module.exports = router;
