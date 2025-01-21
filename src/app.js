const express = require("express");
const {connectDB} = require("./config/database");
const {User} = require("./models/user");
const app  = express();

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


