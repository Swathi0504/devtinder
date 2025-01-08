const express = require("express");
const {validateSignupData} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require('bcrypt');
const authRouter = express.Router();

authRouter.post("/signup", async (req,res)=>{
      
    try {
         validateSignupData(req);
 
         const {firstName,lastName,emailId,password,age,gender,photoUrl,about,skills} = req.body;
 
         const passwordHash = await bcrypt.hash(password,10)
 
         const user = new User({
             firstName,
             lastName,
             emailId,
             password:passwordHash,
             age,
             gender,
             photoUrl,
             about,
             skills
         }) 
         await user.save();
         res.send("User Successfully Saved");
    }
    catch(err) {
        res.send(err.message);
    }
 })
 
 authRouter.post("/login", async (req,res)=>{
     try{
         const {emailId,password} = req.body;
         const user = await User.findOne({ emailId : emailId });
         console.log(user);
         if(!user) {
             throw new Error("Invalid user credentials");
         }
         
         const isPasswordValid = await user.passwordValidation(password);
         if(!isPasswordValid) {
             throw new Error("Invalid user credentials");
         }
          
         const token = await user.getJwt();
 
         res.cookie("token",token)
         res.send("User logged in successfully");
     }
     catch(err) {
         res.status(400).send(err.message);
     }
 })

 module.exports = authRouter;