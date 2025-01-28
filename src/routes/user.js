const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName gender age skills";
//Get all the pending connection requests for the loggedIn User
userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills"]);

        
        res.json({message: "Data Fetched Successfully!", data: connectionRequests })
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", "firstName lastName gender age skills").("toUserId", "firstName lastName gender age skills");


        const data = nectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        let 
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.set(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());

        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ data: users });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})
module.exports = userRouter;