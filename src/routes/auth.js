const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignupData, validatePassword } = require("../utils/validation");
const { userAuth } = require("../middleware/auth");
const authRouter = express.Router();
const cookieParser = require("cookie-parser");
const User  = require("../models/user");

authRouter.use(cookieParser());
authRouter.post("/signup", async(req, res)=>{
    const {firstName, lastName, emailId, password } = req.body;
    validateSignupData(req.body);
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    })
    
    try{
        //saving the user
        await user.save();
        res.send("User Added successfully!!");
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
    
});

authRouter.post("/login", async(req, res)=>{
    try{
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("EmailId not present");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successfull!!!");
        }else{
            throw new Error("Incorrect password");
        }
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("User Logged out successfully!!!");
});

module.exports = authRouter;