const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            visited:0,
            img: [
                {
                    url: 'https://res.cloudinary.com/viru/image/upload/v1616837412/YelpCamp/xybifyxhe3dh6czxodih.jpg',
                    filename: 'YelpCamp/xybifyxhe3dh6czxodih'
                },
                {
                    url: 'https://res.cloudinary.com/viru/image/upload/v1616837364/YelpCamp/tllvcv7ml2ecue6qj8a2.jpg',
                    filename: 'YelpCamp/tllvcv7ml2ecue6qj8a2'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:price,
            author:"605305e520fd60175c80b874"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})