const validator = require("validator");
const validateSignupData = (req) =>{
    const { firstName, lastName, emailId, password } = req;

    if(!firstName || !lastName){
        throw new Error("firstName and lastName shouldn't be empty");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter the valid emailId");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter the strong password");
    }
}

const validateProfileData = (req) =>{
    const allowedEditFields = ["firstName", "lastName", "emailId", "gender", "age", "skills"];

   const isEditAllowed =  Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
}

module.exports = {validateSignupData, validateProfileData};