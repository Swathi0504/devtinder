const connectDb=require("./config/database")
const express = require("express")
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user')

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

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

