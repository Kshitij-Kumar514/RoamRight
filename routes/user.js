const express= require("express");
const router = express.Router();
const User=require("../models/user"); // User model for creating a new user
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware")
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username, email, password}= req.body;
    const newUser = new User({email,username})
    const registerdUser=await User.register(newUser, password);
    console.log(registerdUser);
    req.login(registerdUser , (err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect(req.session.redirectUrl);
    })
    
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/user/login', 
        failureFlash:true})
,async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!!")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
       if(err){
        return next(err);
       } 
       req.flash("success","you are logged out!");
       res.redirect("/listings");
    })
})

module.exports=router;