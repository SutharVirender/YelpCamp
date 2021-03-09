const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const campgroundschema=new Schema({
    title: String,
    location: String,
    price: Number,
    description: String,
    img:String
});
module.exports=mongoose.model('campground',campgroundschema)
