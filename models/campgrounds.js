const { object } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");
const User=require("./users");
const ImageSchema=new Schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
const campgroundschema=new Schema({
    title: String,
    location: String,
    price: Number,
    description: String,
    img:[ImageSchema],
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
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
});
module.exports=mongoose.model('campground',campgroundschema)
