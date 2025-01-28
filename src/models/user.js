const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Entered emailId is not valid:" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "Others"].includes(value)){
                throw new Error("Gender value is not valid")
            }
        }
    },
    skills: {
        type: [String]
    },
}, {timestamps: true});

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$9108");

    return token;
};

userSchema.methods.validatePassword = async function(passwordyUser){
    const user = this;
    const passwordHash = user.passwordyUser;
    const isPasswordValid = await bcrypt.compare(passwordyUser, passwordHash);
    return isPasswordValid;
}
module.exports = mongoose.model("user", userSchema);
