//if(!req.body.campground)  throw new ExpressError('invalid campground data', 400);
const Joi = require('joi');
const ExpressError = require('../helpers/expressError');
const catchAsync = require('../helpers/catchAsync');
//to validate the schemas
const validationInfo = function (req, res, campgroundSchema, next) {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else next();
};

//
module.exports.validateCampground = catchAsync(async (req, res, next) => {
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      // image: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array(),
  });
  validationInfo(req, res, campgroundSchema, next);
  // const { error } = campgroundSchema.validate(req.body);

  // if (error) {
  //   const msg = error.details.map((el) => el.message).join(',');
  //   throw new ExpressError(msg, 400);
  // } else next();
});

//
module.exports.validateReview = catchAsync(async (req, res, next) => {
  const reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required(),
    }).required(),
  });
  validationInfo(req, res, reviewSchema, next);
});
