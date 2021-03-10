const express=require("express");
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const campground=require("./models/campgrounds");
const catchAsync=require("./utils/catchAsync");
const ExpressError=require("./utils/ExpressError");
const { campgroundSchema }=require("./Schemas.js");
const methodoverride=require("method-override");
const { findByIdAndDelete } = require("./models/campgrounds");
const ejsmate=require("ejs-mate");
app.use(methodoverride('_method'));

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

app.engine('ejs',ejsmate);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({ extended: true }));

const validateCampground=(req,res,next)=>{
    const {error} =campgroundSchema.validdate(req.body);
    if (error){
        const msg=error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
};

app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/campgrounds",catchAsync(async(req,res)=>{
    const campgrounds=await campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
});
app.get("/campgrounds/:id",catchAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render("campgrounds/show",{camp});
}));
app.post("/campgrounds",validateCampground,catchAsync(async (req,res,next)=>{
    const newcampground=new campground(req.body.campground);
    await newcampground.save();
    res.redirect('/campgrounds/'+newcampground._id);
}));
app.get("/campgrounds/:id/edit",catchAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
}));

app.put("/campgrounds/:id",validateCampground,catchAsync(async(req,res)=>{
    const camp=await campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground });
    res.redirect("/campgrounds/"+camp._id);
}));
app.delete("/campgrounds/:id",catchAsync(async(req,res)=>{
    await campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}));
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found!!",404));
});
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if (!err.message) err.message ="oh No Something Went Wrong!!"
    res.status(statusCode).render('error',{err});
})
app.listen(3000,function(req,res){
    console.log("###Server has Started visit port 3000");
});