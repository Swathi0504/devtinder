
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req,res,next)=>{
   try {
    const cookies = req.cookies;
    if(!cookies) {
        throw new Error("Invalid token");
    }
    const {token} = cookies;
    const decodedMessage= jwt.verify(token,"DEVTINDER@80722");
    const {_id} = decodedMessage;
    const user = await User.findById(_id);
    if(!user) {
        throw new Error("User dont exist. Please try logging in again.")
    }
    req.user=user;
    next();
   }
   catch(err) {
      res.status(400).send(err.message);
   }
}

module.exports = auth;