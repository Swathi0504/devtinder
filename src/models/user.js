
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
    firstName : {
        type : String,
        required: true,
        minLength: 4,
        maxLength: 100,
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate : (value) => {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address! "+value);
            }
        }
    },
    password : {
        type : String,
        required: true,
        validate : (value) => {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong!!");
            }
        }
    },
    age : {
        type : Number,
        min : 18,
    },
    gender : {
         type : String,
         lowercase: true,
         validate(value) {
           if(!["male","female","others"].includes(value)) {
               throw new Error("Gender data is not valid");
               
           }
         }
    },
    photoUrl : {
        type : String,
        default:"https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg",
        // validate : (value) => {
        //     if(!validator.isURL(value)) {
        //         throw new Error("Invalid url "+value);
        //     }
        // }
    },
    about : {
        type : String,
        default: "This is a default about for the user"
    },
    skills : {
        type : [String],
        maxLength : 10
    }
},
{
    timestamps: true
}
);

userSchema.methods.getJwt = async function() {
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEVTINDER@80722",{expiresIn:"7d"});
    return token;    
}

userSchema.methods.passwordValidation = async function (password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password,user.password);
    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);
module.exports = User;