const express=require("express");
const router=express.Router();
const campground=require("../models/campgrounds");
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn,isAuthor,validateCampground}=require("../middleware")

router.get("/",catchAsync(async(req,res)=>{
    const campgrounds=await campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});
router.get("/:id",catchAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id).populate({path:"reviews",populate:{path:"author"}}).populate("author");
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show",{camp});
}));
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camp});
}));



router.post("/",isLoggedIn,validateCampground,catchAsync(async (req,res,next)=>{
    const newcampground=new campground(req.body.campground);
    newcampground.author=req.user._id;
    await newcampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('/campgrounds/'+newcampground._id);
}));
router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(async(req,res)=>{
    const camp=await campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect("/campgrounds/"+camp._id);
}));
router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    await campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect("/campgrounds");
}));

module.exports=router;