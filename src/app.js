const express = require("express")

const app = express();

const {auth} = require("./middlewares/auth")

app.all("/admin",auth)

app.get("/admin/adduser",(req,res)=>{
    res.send("User authorised");
})
app.delete("/admin/deleteuser",(req,res)=>{
    res.send("User removed");
})

app.listen(3000,()=>{
    console.log("Server is successfully listening");
});


