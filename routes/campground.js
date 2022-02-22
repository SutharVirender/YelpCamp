const express=require("express");
const router=express.Router();
const campground=require("../models/campgrounds");
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");
const {isLoggedIn,isAuthor,validateCampground}=require("../middleware")
const multer=require("multer");
const {storage}=require("../cloudinary");
const upload=multer({storage});
const {cloudinary}=require("../cloudinary");
const mbgeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const campgrounds = require("../models/campgrounds");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbgeocoding({accessToken:mapBoxToken});
// const geolocation = require('geolocation')
// const navigator=require('browser-env')(["navigator"]);
// console.log(navigator.geolocation)


let lat=28.644800;
let lon=77.216721;

router.get("/",catchAsync(async(req,res)=>{
    if(req.query.lat){
    lat=parseFloat(req.query.lat);
    lon=parseFloat(req.query.lon);
    }
    var x=0;
    var campgr=await campground.find({}).populate('popupText');
    var campgrounds=await campground.find({
        geometry:
          { $near :
             {
               $geometry: { type: 'Point',  coordinates: [lon,lat] },
               $minDistance: 0,
               $maxDistance: 5000000
             }
          }
      })
    res.render('campgrounds/index',{campgrounds,x,campgr});
}));
router.get("/x=:s",catchAsync(async(req,res)=>{
    var x=req.params.s;
    var campgr=await campground.find({}).populate('popupText');
    if (x=='0'){
        var campgrounds=await campground.find({
            geometry:
              { $near :
                 {
                   $geometry: { type: 'Point',  coordinates: [lon,lat] },
                   $minDistance: 0,
                   $maxDistance: 5000000
                 }
              }
          })
    }
    else if(x=='1'){
        var campgrounds=await campground.find({}).sort({"createdAt":-1}).populate('popupText');
    }
    else if(x=='2'){
        var campgrounds=await campground.find({}).sort({"createdAt":1}).populate('popupText');
    }
    else{
        var campgrounds=await campground.find({}).sort({"visited":-1}).populate('popupText');
    }
    res.render('campgrounds/index',{campgrounds,x,campgr});
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
    const t=camp.visited;
    await campgrounds.findByIdAndUpdate(req.params.id,{visited:t+1});
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



router.post("/",isLoggedIn,upload.array("image"),validateCampground,catchAsync(async (req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const newcampground=new campground(req.body.campground);
    newcampground.geometry=geoData.body.features[0].geometry;
    newcampground.img=req.files.map(f=>({url: f.path,filename: f.filename}));
    newcampground.author=req.user._id;
    await newcampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('/campgrounds/'+newcampground._id);
}));
router.put("/:id",isLoggedIn,isAuthor,upload.array("image"),validateCampground,catchAsync(async(req,res)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    // const t=await campground.findByIdAndUpdate(req.params.id,{geometry:geoData.body.features[0].geometry});
    const camp=await campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground,geometry:geoData.body.features[0].geometry});
    const imgs=req.files.map(f=>({url: f.path,filename: f.filename}));
    camp.img.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
        for(let filname of req.body.deleteImages){
            await cloudinary.uploader.destroy(filname);
        }
        await campground.updateOne({$pull:{img:{filename:{$in:req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect("/campgrounds/"+camp._id);
}));
router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    await campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect("/campgrounds");
}));

module.exports=router;