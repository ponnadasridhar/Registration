const express = require("express");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 27107;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ldk1qvo.mongodb.net/?retryWrites=true&w=majority`);
//mongodb+srv://<username>:<password>@cluster0.ldk1qvo.mongodb.net/?retryWrites=true&w=majority
//registration schema
const registrationSchema=new mongoose.Schema({
    name1:String,
    email:String,
    password:String
});

//mode of registration
const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get("/",(req,res) =>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register",async(req,res)=>{
    try{
        const{name1,email,password} = req.body;

        const existingUser = await Registration.findOne({email:email});
        if(!existingUser)
        {
        const registrationData=new Registration({
            name1,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{
        alert("User already exists");
        res.redirect("/error");
    }
}
    catch (error){
        console.log(error);
        res.redirect("/error")
    }
});

app.get("/success",(req,res) =>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res) =>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})