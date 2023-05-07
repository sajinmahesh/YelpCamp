const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect(
  'mongodb+srv://sajinm461:1234@mydatabase.pa6gsri.mongodb.net/yelp-camp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30);
    const camp = new Campground({
      author: '64465fe813247e333ccbd54a',
      location: `${cities[random].city},${cities[random].state}  `,
      title: `${sample(descriptors)} ${sample(places)} `,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad numquam ab aut enim? Nisi adipisci corrupti repudiandae illum eveniet eum amet quis doloremque sequi. Quam rerum dolorum quas culpa non.',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dtoou38lm/image/upload/v1682928344/YelpCamp/r38bsqwjh2k3r2rmtawt.png',
          filename: 'YelpCamp/r38bsqwjh2k3r2rmtawt',
        },
        {
          url: 'https://res.cloudinary.com/dtoou38lm/image/upload/v1682928361/YelpCamp/jvseqmgshexudzxgva4a.png',
          filename: 'YelpCamp/jvseqmgshexudzxgva4a',
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
