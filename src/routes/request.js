const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/user')
const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId",
   auth,
   async (req,res)=>{
   try {
       const toUserId = req.params.toUserId;
       const fromUserId = req.user._id;
       const status = req.params.status;

       const allowedStatus = ["interested","ignored"];

       if(!allowedStatus.includes(status)) {
         res.status("400").send("Invalid status type");
         return;
       }

       const isValidToUser = await User.findById(toUserId);
       if(!isValidToUser) {
         return res.status(404).json({ message : "User not found!" });
       }

       const existingConnectionRequest = await ConnectionRequest.findOne({
         $or: [
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
         ]
       })

       if(existingConnectionRequest) {
         res.status("400").json({message:"Request already sent",});
         return;
       }


       const connectionRequest = new ConnectionRequest({
         fromUserId : fromUserId,
         toUserId : toUserId,
         status : status
       });  

       const data = await connectionRequest.save();
       res.json({
         message : "Connection request sent successfully",
         data : data,
       });
   }
   catch(err) {
       res.status(400).send("ERROR: "+err.message);
   }
})

requestRouter.post("/sendconnectionrequest",auth, async (req,res)=>{
    try {
        const user = req.body;
        res.send(user.firstName+" sent a connection request!");
    }
    catch(err) {

    }
})

//getting all users
requestRouter.get("/feed",async (req,res)=>{
    try {
       const users = await User.find({});
       res.send(users);
    }
    catch(err) {
       res.status(404).send("Something went wrong");
    }
})

requestRouter.delete("/user",async(req,res)=>{
    try {
       const user=await User.findByIdAndDelete({_id:req.body.id});
       res.send("User deleted successfully")
    }catch(err) {
       res.status(400).send("Unable to delete"); 
    }
})

requestRouter.patch("/user/:id",async(req,res)=>{
    const data = req.body;
    const id = req.params?.id;
    try {
       
       const ALLOWED_UPDATES = ["firstName","lastName","password","age","gender","photoUrl","about","skills"];

       const isupdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
       );

       if(!isupdateAllowed){
        throw new Error("Update not allowed");
       }

       if(data.skills.length>10) {
        throw new Error("Skills cannot be more than 10");
       }

       const user=await User.findByIdAndUpdate({_id:id},data,{
        returnDocument:"before",
        runValidators:"true"
       });
       console.log(user);
       res.send("User updated successfully")
    }catch(err) {
       res.status(400).send("Something went wrong. "+ err.message); 
    }
})


module.exports = requestRouter;