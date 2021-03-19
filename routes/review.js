const express=require("express");
const router=express.Router({mergeParams:true});
const campground=require("../models/campgrounds");
const {reviewSchema}=require("../Schemas.js");
const Review = require("../models/review");
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const {validateReview,isReviewAuthor,isLoggedIn}=require("../middleware");

router.post("/",isLoggedIn,validateReview,catchAsync(async(req,res,next)=>{
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    const camp=await campground.findById(req.params.id);
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash('success', 'Created new review!');
    res.redirect("/campgrounds/"+camp._id);
}));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
    const {id,reviewId}=await req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect("/campgrounds/"+id);
}));

module.exports=router;