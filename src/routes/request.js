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

requestRouter.post("/request/review/:status/:requestId",
   auth,
   async (req,res)=>{
   try {
      const loggedInuser = req.user;
      const allowedStatus = ["accepted","ignored"];
      const {status,requestId} = req.params;

      if(!allowedStatus.includes(status))  {
         return res.status(400).json({message : "Invalid status type"});
      }

      const connectionRequest = await ConnectionRequest.findOne({
         _id : requestId,
         toUserId : loggedInuser._id,
         status : "interested"
      });

      if(!connectionRequest) {
         return res.status(404).send("Connection request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({
         message : "Connection request accepted suuccessfully",
         userdetails : data
      })

   }
   catch(err) {
       
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

module.exports = requestRouter; 