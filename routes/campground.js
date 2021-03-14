const express=require("express");
const router=express.Router();
const campground=require("../models/campgrounds");
const { campgroundSchema}=require("../Schemas.js");
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");

const validateCampground=(req,res,next)=>{
    const {error} =campgroundSchema.validate(req.body);
    if (error){
        const msg=error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
};

router.get("/",catchAsync(async(req,res)=>{
    const campgrounds=await campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
router.get("/new",(req,res)=>{
    res.render("campgrounds/new");
});
router.get("/:id",catchAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id).populate("reviews");
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show",{camp});
}));
router.get("/:id/edit",catchAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camp});
}));



router.post("/",validateCampground,catchAsync(async (req,res,next)=>{
    const newcampground=new campground(req.body.campground);
    await newcampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('/campgrounds/'+newcampground._id);
}));
router.put("/:id",validateCampground,catchAsync(async(req,res)=>{
    const camp=await campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect("/campgrounds/"+camp._id);
}));
router.delete("/:id",catchAsync(async(req,res)=>{
    await campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect("/campgrounds");
}));

module.exports=router;