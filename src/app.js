const connectDb=require("./config/database")
const express = require("express")
const User = require("./models/user")

const app = express();

app.use(express.json())

app.post("/signup", async (req,res)=>{

   console.log(req.body);
    
   const user = new User(req.body)
    
   try {
        await user.save();
        res.send("User Successfully Saved");
   }
   catch(err) {
       res.send(err);
   }
})


//getting user data by email address\
app.get("/finduser",async (req,res)=>{
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

//getting all users
app.get("/feed",async (req,res)=>{
     try {
        const users = await User.find({});
        res.send(users);
     }
     catch(err) {
        res.status(404).send("Something went wrong");
     }
})

app.delete("/user",async(req,res)=>{
    try {
       const user=await User.findByIdAndDelete({_id:req.body.id});
       res.send("User deleted successfully")
    }catch(err) {
       res.status(400).send("Unable to delete"); 
    }
})

app.patch("/user",async(req,res)=>{
    const data = req.body;
    try {
       const user=await User.findByIdAndUpdate({_id:req.body.id},data,{
        returnDocument:"before",
        runValidators:"true"
       });
       console.log(user);
       res.send("User updated successfully")
    }catch(err) {
       res.status(400).send("Something went wrong"+ err.message); 
    }
})

connectDb().then(()=>{
    console.log("Database connection established");
    /*****app.listen*****/
    app.listen(3000,()=>{
        console.log("Server is successfully listening");
    });    
}).catch(err=>{
    console.log("Database cannot be connected", err);
}
)

