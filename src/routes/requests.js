const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestsRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status Type: " + status });

        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).send({message: " User is not found"});
        }
        //If there is an an existing connection request

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({
                message: "Connection request already Exist!!"
            });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName+"is " + status+" in "+ toUser.firstName,
            data
        });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestsRouter;