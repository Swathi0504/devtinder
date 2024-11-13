const connectDb=require("./config/database")
const express = require("express")
const User = require("./models/user")

const app = express();

app.post("/signup", async (req,res)=>{
    
   const user = new User({
     firstName : "Swathi",
     lastName : "Sivakumar",
     emailId : "swathisivakumarbecse@gmail.com",
     password : "Swathi@123",
     age : 24,
     gender : "F"
   })
    
   try {
        await user.save();
        res.send("User Successfully Saved");
   }
   catch(err) {
       res.send("Unable to save the data");
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

