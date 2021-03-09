const express=require("express");
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const campground=require("./models/campgrounds");
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

app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/campgrounds",async(req,res)=>{
    const campgrounds=await campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
})
app.get("/campgrounds/:id",async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render("campgrounds/show",{camp});
});
app.post("/campgrounds",async(req,res)=>{
    const newcampground=new campground(req.body.campground);
    await newcampground.save();
    res.redirect('/campgrounds/'+newcampground._id);
});
app.get("/campgrounds/:id/edit",async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp});
})
app.put("/campgrounds/:id",async(req,res)=>{
    const camp=await campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground });
    res.redirect("/campgrounds/"+camp._id);
});
app.delete("/campgrounds/:id",async(req,res)=>{
    await campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
})
app.listen(3000,function(req,res){
    console.log("###Server has Started visit port 3000");
});