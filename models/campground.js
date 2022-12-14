const mongooose = require('mongoose');
const Review = require('./review');
const Schema = mongooose.Schema;

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
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
