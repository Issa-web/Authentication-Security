//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption")

 
 
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// creating schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

//   console.log(process.env.SECRET)
var secret = "thisourlittlesecret";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] } );
  // creating model 
  const User = mongoose.model("User", userSchema);
app.get("/", (req, res)=>{
    res.render("home")
});
app.get("/login", (req, res)=>{
    res.render("login")
});
app.get("/register", (req, res)=>{
    res.render("register")
});

app.post("/register", (req, res) =>{
    let newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) =>{
        if(!err){
            res.render("secrets")
        }else{
            console.log(err)
        }
    })
});

app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: username,
    }, (err, foundUser) =>{
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    })
})


app.listen(3000, () =>{
   console.log("Server is running on port 3000")
});