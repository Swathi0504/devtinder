const express = require("express");
const auth = require('../middlewares/auth');

const profileRouter = express.Router();

profileRouter.post("/profiles", auth ,async (req,res) => {
    
    try {
        const user = req.user;
        res.send(user);
    }
    catch(err) {
        res.status("400").send(err.message);
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


module.exports = profileRouter;
