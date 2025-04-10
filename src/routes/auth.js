const express = require("express");
const {validateSignupData} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require('bcrypt');
const authRouter = express.Router();

authRouter.post("/signup", async (req,res)=>{
      
    try {
         validateSignupData(req);
 
         const {firstName,lastName,emailId,password} = req.body;
 
         const passwordHash = await bcrypt.hash(password,10)
 
         const user = new User({
             firstName,
             lastName,
             emailId,
             password:passwordHash,
         }) 
         const savedUser=await user.save();
         const token = await savedUser.getJwt();
 
         res.cookie("token",token,{
            expires: new Date(Date.now()+8*3600000),
         });
         //console.log(savedUser);
         res.send(savedUser);
    }
    catch(err) {
        console.log(err);
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
 
         res.cookie("token",token,{
            expires: new Date(Date.now()+8*3600000),
         });
         res.send(user);
     }
     catch(err) {
         res.status(400).send(err.message);
     }
 })

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now()),
    });
    res.send("Logout Successfully!!");
}) 

 module.exports = authRouter;