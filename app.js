const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const app = express();
const path = require('path');
const Campground = require('./models/campground');
const Review = require('./models/review');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const catchAsync = require('./helpers/catchAsync');
const ExpressError = require('./helpers/expressError');
const { validateCampground, validateReview } = require('./middleware/schema');

mongoose.connect(
  'mongodb+srv://sajinm461:1234@mydatabase.pa6gsri.mongodb.net/yelp-camp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('data base connceted');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
  res.render('home');
});

app.use('*', (req, res, next) => {
  next(new ExpressError('no page available ', 400));
});
app.use((err, req, res, next) => {
  const { statusCode = 400 } = err;
  if (!err.message) err.message = 'something went wrong da';
  res.status(statusCode).render('error', { err });
});

app.listen('3000', () => {
  console.log('server running on 3000');
});
