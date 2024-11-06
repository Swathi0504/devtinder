const express = require("express")

const app = express();

app.use("/test",(req,res)=>{
    res.send("test page");
})

app.use("/",(req,res)=>{
    res.send("Welcome");
})

app.use("/hello",(req,res)=>{
    res.send("Hello page");
})

app.listen(3000,()=>{
    console.log("Server is successfully listening");
});