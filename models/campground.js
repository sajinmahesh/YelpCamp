const mongooose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { string } = require('joi');
const Schema = mongooose.Schema;

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200/'); // creating  virtual thumbnails to images property
});
const campgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});
campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});
module.exports = mongooose.model('Campground', campgroundSchema);
