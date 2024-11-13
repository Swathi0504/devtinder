const mongoose = require("mongoose");


const connectDb= async()=>{
    await mongoose.connect("mongodb+srv://swathisivakumar:hHqK5iXj4SfgGPur@cluster0.y1rpt.mongodb.net/Devtinder");
}

module.exports = connectDb;
