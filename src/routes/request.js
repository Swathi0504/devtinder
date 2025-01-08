const express = require('express');
const auth = require('../middlewares/auth');

const requestRouter = express.Router();

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