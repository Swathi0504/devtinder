const express = require("express");
const auth = require('../middlewares/auth');
const {validateEditProfileData} =require("../utils/validation");

const profileRouter = express.Router();

profileRouter.post("/profiles/view", auth ,async (req,res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch(err) {
        res.status("400").send("Invalid token");
    }
})

profileRouter.patch("/profiles/edit",auth, async (req,res)=>{
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request");
    }

    const loggedinuser = req.user;
     
    Object.keys(req.body).forEach((key)=>(loggedinuser[key]=req.body[key]));
    loggedinuser.save();
    
    res.json(
    {
        message:`${loggedinuser.firstName} profile updated successfully!!`,
        data: loggedinuser,
    })

  }
  catch(err) {
    res.status(400).send("Error:"+ err.message);
  }
})

//getting user data by email address
profileRouter.get("/finduser",async (req,res)=>{
    try {
        const user = await User.find({"emailId": req.body.emailId});
        if(user.length===0) {
            res.status(404).send("User not found");
        }
        res.send(user);
    }
    catch(err) {
       res.status(400).send("Something went wrong");
    }
})

profileRouter.patch("/profiles/password",auth, async (req,res)=>{

})



module.exports = profileRouter;
