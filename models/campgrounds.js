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
    if (this.url.includes('upload/c_scale,w_450')){
        return this.url.replace('upload/c_scale,w_450','/upload/w_200,h_200');
    }
    return this.url.replace('upload/c_scale,h_300,w_450','/upload/w_200,h_200');
});
const opts = { toJSON: { virtuals: true } };

const campgroundschema=new Schema({
    title: String,
    location: String,
    price: Number,
    description: String,
    visited:{
        type:Number,
        default:0

    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    img:[ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
        }

    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
},opts);
campgroundschema.index({geometry:'2dsphere'});

campgroundschema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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
