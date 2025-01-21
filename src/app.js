const express = require("express");
const {connectDB} = require("./config/database");
const {User} = require("./models/user");
const app  = express();

//recieves the Json body and converts it into the javaScript object
app.use(express.json());
app.post("/signup", async(req, res)=>{
    //Create the new instance of the user
    const user = new User(req.body); 
    
    try{
        //saving the user
        await user.save();
        res.send("User Added successfully!!");
    }catch(err){
        res.status(400).send("Error saving the user: ", err);
    }
    
});

//Get user by Email
app.get("/user", async(req, res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId: userEmail});
        if(users.length === 0){
            res.status(400).send("User Not Found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
    
})

//get all the users from the database
app.get("/feed", async(req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Someting went wrong");
    }
});

app.patch("/user", async(req, res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        await User.findByIdAndUpdate({_id: userId}, data);
        res.send("user updated successfully");
    }catch(err){
        res.status.apply(400).send("Something went wrong");
    }
})
connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(3000, ()=> {
            console.log("Server is successfully listening on server 3000...");
        });
    })
    .catch((err) =>{
        console.log("Error", err);
        console.error("Database cannot be established");
    });


