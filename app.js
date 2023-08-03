require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const port = 9000;
const app = express();
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to false

}))
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://127.0.0.1:27017/SecretsDB")
const userSchema = new mongoose.Schema({
    email: {
        type: String,

    },
    password: {
        type: String,

    }
})
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/logout", (req, res) => {
    req.logOut(()=>{
        res.redirect("/");
    });
})
app.get("/secrets", (req, res) => {

    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        res.render("secrets");
    else res.redirect("/login")
});

app.post("/register", async (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.send('There was an error');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            })
        }
    })
});
app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    const user = new User({username : email,password});
    req.login(user,(err)=>{
        if(err) console.log(err);
        else {
            passport.authenticate("local")(req,res,()=>{
                res.statusCode(200).redirect("/secrets")
            })
        }

    })
})







app.listen(port, () => {
    console.log(`listenin at port ${port}`);
})