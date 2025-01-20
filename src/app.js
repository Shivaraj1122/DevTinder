const express = require("express");
const app  = express();

const {adminAuth} = require("./middleware/adminAuth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) =>{
    res.send("All data sent");
});

app.delete("/admin/deleteUser", (req, res) =>{
    res.send("Deleted the user");
});

app.listen(3000, ()=> {
    console.log("Server is successfully listening on server 3000...");
});