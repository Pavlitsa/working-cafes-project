const express = require("express");
const router = express.Router();

//connect this route with the User model
const User = require("../models/User");
const Cafes = require("../models/Cafes");

/* GET home page */

// Here we create all the routes that are related to the landing or home page or anything that is in the big 'views' folder

// the browser is asking the server to read the /homepage and display in html form whatver is inside the index.hbs file

router.get("/", (req, res, next) => {
  res.render("index");
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
};

router.get("/cafeForm", loginCheck(), (req, res, next) => {
  res.render("cafeForm.hbs");
});

router.get("/cafes", loginCheck(), (req, res, next) => {
  // console.log("route cafe");
  Cafes.find()
    .then(cafe => {
      // console.log(cafe);
      res.render("cafes.hbs", { cafe: cafe });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/cafes/:cafeId", loginCheck(), (req, res, next) => {
  Cafes.findById(req.params.cafeId);
  res.render("cafeDetails.hbs");
});

router.post("/cafes", loginCheck(), (req, res, next) => {
  Cafes.create({
    name: req.body.name,
    address: req.body.address,
    description: req.body.description
  })
    .then(cafe => {
      res.redirect("/cafes");
    })
    .catch(err => {
      next(err);
    });
});

router.post("/cafes/:cafeId", (req, res, next) => {
  Cafes.findById(req.params.findById);
  res.render("cafeDetails.hbs");
});

module.exports = router;
