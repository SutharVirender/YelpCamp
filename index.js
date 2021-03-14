const express=require("express");
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodoverride=require("method-override");
const { findByIdAndDelete } = require("./models/campgrounds");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const Review = require("./models/review");
const campgrounds=require("./routes/campground");
const reviews=require("./routes/review");

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
app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/review",reviews);

app.get("/",(req,res)=>{
    res.render("home");
});

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