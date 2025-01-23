const mongoose = require("mongoose");

const connectionRequestScema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        },
    },
},
{ timestamps: true }
);


connectionRequestScema.index({ fromUserId: 1, toUserId: 1})
connectionRequestScema.pre("save", function(next){
    const connectionRequest = this;
    //check if from user ID is same as the to user ID
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});
const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestScema);

module.exports = connectionRequestModel;