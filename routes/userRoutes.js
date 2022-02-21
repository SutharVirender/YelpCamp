const express=require("express");
const passport = require("passport");
const router=express.Router();
const User=require("../models/users");
const catchAsync = require("../utils/catchAsync");


router.get("/register",(req,res)=>{
    res.render("user/register");
});
router.post("/register",catchAsync(async (req,res)=>{
    try{
        const{username,email,password}=req.body;
        const user=new User({username,email});
        const registerUser= await User.register(user,password);
        req.login(registerUser,err=>{
            if (err) return next(err);
            req.flash("success","User has Register Successfully!!");
<<<<<<< HEAD
            res.redirect("/");
=======
            res.redirect("/campgrounds");
>>>>>>> dcd7d687346d3cfa6747bdc65fb1bc96e5bcf9ff
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/register");
    }
}));
router.get("/login",(req,res)=>{
    res.render("user/login");
});
router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),catchAsync(async(req,res)=>{
    req.flash("success","Welcome Back!!");
<<<<<<< HEAD
    const redirectUrl=req.session.returnTo || "/";
=======
    const redirectUrl=req.session.returnTo || "/campgrounds";
>>>>>>> dcd7d687346d3cfa6747bdc65fb1bc96e5bcf9ff
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}));
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","GoodBye!!!");
<<<<<<< HEAD
    res.redirect("/");
=======
    res.redirect("/campgrounds");
>>>>>>> dcd7d687346d3cfa6747bdc65fb1bc96e5bcf9ff
});
module.exports=router; 