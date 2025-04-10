const mongoose = require("mongoose");


const connectDb= async()=>{
    await mongoose.connect("mongodb+srv://swathisivakumar:YQ5bgtKF8KIMioG5@cluster0.y1rpt.mongodb.net/Devtinder");
}

module.exports = connectDb;
