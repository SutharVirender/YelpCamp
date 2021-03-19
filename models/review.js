const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User=require("./users");
const ReviewSchema= new Schema({
    rating:Number,
    reviewbody:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports=mongoose.model("Review",ReviewSchema);