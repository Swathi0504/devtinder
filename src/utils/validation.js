const validator = require('validator');


const validateSignupData= (req) => {
    const {firstName, lastName,emailId,password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("Please enter valid name");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid email address! "+emailId);
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a valid password!");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isValid=Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isValid;
}



module.exports = {validateSignupData,validateEditProfileData};