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

