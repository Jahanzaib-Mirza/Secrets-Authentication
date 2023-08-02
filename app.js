require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const ejs = require("ejs");
const bodyParser = require("body-parser");


const saltRounds = 10;
const port = 9000;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/SecretsDB")
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

const User = mongoose.model("User",userSchema);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");


app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const user = new User({email : req.body.username,
            password : hash
        })
        user.save().then((val)=>{
            console.log(val);
            res.render("secrets")
        })
    });
})
app.post("/login",(req,res)=>{
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email}).then((val)=>{
        bcrypt.compare(password, val.password, function(err, result) {
            res.render("secrets")
        });
    })
})







app.listen(port,()=>{
console.log(`listenin at port ${port}`);
})