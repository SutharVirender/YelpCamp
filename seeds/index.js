const mongoose = require('mongoose');
const cities = require('./cities');
const cit=require('./in')
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');
const Review=require('../models/review');
const dburl="mongodb+srv://first_user:puhOwaT6ddaVcExy@yelpcamp.grx20.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dburl, {
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
img1=[
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,h_300,w_450/v1619878172/YelpCamp/nofi-sofyan-hadi-2wcfY2qeFFE-unsplash_zmyprf.jpg',
        filename: 'YelpCamp/nofi-sofyan-hadi-2wcfY2qeFFE-unsplash_zmyprf'
    },
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,w_450/v1619878172/YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_jvlf1b.jpg',
        filename: 'YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_jvlf1b'
    }
]
img2=[
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,w_450/v1619890915/YelpCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_1_pjdnxc.jpg',
        filename: 'YelpCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_1_pjdnxc'
    },
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,h_300,w_450/v1619890829/YelpCamp/sergey-chuprin-IonPZAQTV0Y-unsplash_dp6tp9.jpg',
        filename: 'YelpCamp/sergey-chuprin-IonPZAQTV0Y-unsplash_dp6tp9'
    }
]
img3=[
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,h_300,w_450/v1616837412/YelpCamp/xybifyxhe3dh6czxodih.jpg',
        filename: 'YelpCamp/xybifyxhe3dh6czxodih'
    },
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,w_450/v1619877931/YelpCamp/image5_defltb.jpg',
        filename: 'YelpCamp/image5_defltb'
    }
]
img4=[
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,w_450/v1619877931/YelpCamp/image5_defltb.jpg',
        filename: 'YelpCamp/image5_defltb'
    },
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,h_300,w_450/v1616837412/YelpCamp/xybifyxhe3dh6czxodih.jpg',
        filename: 'YelpCamp/xybifyxhe3dh6czxodih'
    }
]
img5=[
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,h_300,w_450/v1619890829/YelpCamp/sergey-chuprin-IonPZAQTV0Y-unsplash_dp6tp9.jpg',
        filename: 'YelpCamp/sergey-chuprin-IonPZAQTV0Y-unsplash_dp6tp9'
    },
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,w_450/v1619890915/YelpCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_1_pjdnxc.jpg',
        filename: 'YelpCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_1_pjdnxc'
    }
]
img6=[
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,w_450/v1619878172/YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_jvlf1b.jpg',
        filename: 'YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_jvlf1b'
    },
    {
        url: 'https://res.cloudinary.com/viru/image/upload/c_scale,h_300,w_450/v1619878172/YelpCamp/nofi-sofyan-hadi-2wcfY2qeFFE-unsplash_zmyprf.jpg',
        filename: 'YelpCamp/nofi-sofyan-hadi-2wcfY2qeFFE-unsplash_zmyprf'
    }
]
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const review1=new Review({
            rating:4,
            reviewbody:"This is very good camp in all means like food, view, facilities.",
            author:"608d8bd343ad270015cac9cf"
        })
        await review1.save();
        const review2=new Review({
            rating:5,
            reviewbody:"An amazing getaway from the hustle of city life. CampRoxx has everything planned perfectly for your stay. Comfortable cabins, delicious meals, dj, bonfire, the list goes on.Really look forward to visit again.",
            author:"608d8bd343ad270015cac9cf"
        })
        await review2.save();
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
            img:[img1,img2,img3,img4,img5,img6][i%6],
            reviews:[review1._id,review2._id],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:price,
            author:"608d4116c9cebb1a2c99e33e"
        })
        await camp.save();
    }
    for (let i = 0; i < 180; i++) {
        const random1000 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const review1=new Review({
            rating:4,
            reviewbody:"This is very good camp in all means like food, view, facilities.",
            author:"608d8bd343ad270015cac9cf"
        })
        await review1.save();
        const review2=new Review({
            rating:5,
            reviewbody:"An amazing getaway from the hustle of city life. CampRoxx has everything planned perfectly for your stay. Comfortable cabins, delicious meals, dj, bonfire, the list goes on.Really look forward to visit again.",
            author:"608d8bd343ad270015cac9cf"
        })
        await review2.save();
        const camp = new Campground({
            location: `${cit[random1000].city}, ${cit[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cit[random1000].lng,
                    cit[random1000].lat,
                ]
            },
            visited:0,
            img:[img1,img2,img3,img4,img5,img6][i%6],
            reviews:[review1._id,review2._id],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:price,
            author:"608d4116c9cebb1a2c99e33e"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})