const express = require('express');
const router = express.Router();

const catchAsync = require('../helpers/catchAsync');

const { isLoggedIn } = require('../middleware');
const ExpressError = require('../helpers/expressError');
const Campground = require('../models/campground');
const { validateCampground } = require('../middleware/schema');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
      req.flash('error', 'campground not found');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);
router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'successfully created a new campground');
    res.status(200).redirect(`/campgrounds/${campground._id}`);
  })
);
router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash('error', 'campground not found');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);
router.put(
  '/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'campground updated successfully');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campround');
    res.redirect('/campgrounds');
  })
);
module.exports = router;
