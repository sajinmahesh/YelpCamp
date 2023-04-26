const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/expressError');

const Campground = require('../models/campground');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');

const { validateCampground, validateReview } = require('../middleware/schema');

router.post(
  '/',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'created new review');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
  })
);
module.exports = router;
