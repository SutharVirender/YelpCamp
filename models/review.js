const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ReviewSchema= new Schema({
    rating:Number,
    reviewbody:String
});
module.exports=mongoose.model("Review",ReviewSchema);