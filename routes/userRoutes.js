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
            res.redirect("/campgrounds");
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
    const redirectUrl=req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}));
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","GoodBye!!!");
    res.redirect("/campgrounds");
});
module.exports=router; 