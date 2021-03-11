const { object } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");
const campgroundschema=new Schema({
    title: String,
    location: String,
    price: Number,
    description: String,
    img:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
});
campgroundschema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('campground',campgroundschema)
