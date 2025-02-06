const express = require('express');
const auth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get("/user/requests/received", auth, async(req,res)=>{
    try {
        const loggedInuser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInuser._id,
            status : "interested"
        }).populate("fromUserId",USER_SAFE_DATA);

        res.json({
            message:"Interests sent to you",
            Interests_pending : connectionRequests
        })
    }
    catch(err) {
        res.status(400).send(err.message);
    }
})

userRouter.get("/user/connections",auth,async (req,res)=>{
     try {
          const loggedInuser = req.user;
          const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId:loggedInuser._id,status:"accepted"},
                {fromUserId:loggedInuser._id,status:"accepted"}
            ]
          })
          .populate("fromUserId",USER_SAFE_DATA)
          .populate("toUserId",USER_SAFE_DATA);

          const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInuser._id.toString()) {
                return row.toUserId;
            }
            else {
                return row.fromUserId;
            }
          })

          res.json({data});
     }
     catch(err) {
          res.send(err.message);
     }
})

userRouter.get("/users/feed",auth,async (req,res)=>{
    try {
       const loggedInuser = req.user;

       const page = parseInt(req.query.page)||1;
       let limit = parseInt(req.query.limit)||1;

       limit = limit > 50 ? 50 : limit;

       const skip = (page-1)*limit;
        
       const connectionRequests = await ConnectionRequest.find({
            $or:[
                {
                    fromUserId : loggedInuser._id
                },
                {
                    toUserId : loggedInuser._id
                }
            ]
        }).select("fromUserId toUserId")
        
        const hiddenUsersFromFeed = new Set();

        connectionRequests.forEach((req)=>{
            hiddenUsersFromFeed.add(req.fromUserId.toString());
            hiddenUsersFromFeed.add(req.toUserId.toString());
        })
        const users = await User.find({
            $and:[{_id : {$nin : Array.from(hiddenUsersFromFeed)},
                _id : {$ne : loggedInuser._id}
        }]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(users)
    }
    catch(err) {
       res.status(404).send(err.message);
    }
})


module.exports = userRouter;