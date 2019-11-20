const express = require("express");

// connect to passport
const passport = require("passport");
const router = express.Router();

// connect to my User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcryptjs = require("bcryptjs");

// salt is creating hashes in a specific way. Every company/project is/should be creating hashes with different salt in order to create different hases for different passwords, to avoid hacking

const bcryptSalt = 10;

// GET is a request only for reading data
// res.render => transforms the hbs file into html so that it can be displayed on the browser
// When the client/browser sends a request to the server, it actually sends an object, which is either empty (GET) or it includes some information that the server needs to do something with (POST)
// Here the browser is asking the server to read this login page

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

// POST changes the system state. It inserts or alters inside the database

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/cafes",
    failureRedirect: "/auth/login",
    failureFlash: true, //This is what will allow us to use flash messages in our application
    passReqToCallback: true
  })
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    successRedirect: "/"
  })
);

// Here the browser is asking the server to read this signup page
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// The browser is sending an object that contains username and password. The server takes those two and acts on them to make changes
//If the username or password is an empty string, it displays a specific message
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  // the server searches the database and if it finds the username there, it displays another message
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    // added by me
    if (
      password.length < 8 &&
      password === "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/"
    ) {
      res.render("auth/signup", { message: "Password is too short" });
      return;
    }

    const salt = bcryptjs.genSaltSync(bcryptSalt);
    const hashPass = bcryptjs.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    // otherwise the server creates a new user and redirects to the initial page
    newUser
      .save()
      .then(() => {
        res.redirect("/cafes");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
