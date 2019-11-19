const express = require("express");
const router = express.Router();

//connect this route with the User model
const User = require("../models/User");
const Cafes = require("../models/Cafes");

// Mapbox model
const Point = require("../models/Point");

/* GET home page */

// Here we create all the routes that are related to the landing or home page or anything that is in the big 'views' folder

// the browser is asking the server to read the /homepage and display in html form whatver is inside the index.hbs file

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/api/points", (req, res, next) => {
  Point.find()
    .then(points => {
      res.json(points);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/api/points", (req, res, next) => {
  // retrieve coordinates from req.body
  console.log(req.body);
  // use these coordinates to create a Point
  Point.create({
    coordinates: req.body.coordinates
  })
    .then(() => {
      res.json();
    })
    .catch(err => {
      next(err);
    });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  };
};

router.get("/cafeForm", loginCheck(), (req, res, next) => {
  res.render("cafeForm.hbs");
});

router.get("/cafes", loginCheck(), (req, res, next) => {
  console.log(req.user);
  Cafes.find()
    .then(cafe => {
      //console.log(cafe);
      res.render("cafes.hbs", { user: req.user.username, cafe: cafe });
    })
    .catch(err => {
      next(err);
    });
});

// router.get("/cafes/:cafeId", loginCheck(), (req, res, next) => {
//   Cafes.findById(req.params.cafeId);
//   res.render("cafeDetails.hbs");
// });

router.post("/cafes", loginCheck(), (req, res, next) => {
  Cafes.create({
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    postedBy: req.body.user
  })
    .then(cafe => {
      res.redirect("/cafes");
    })
    .catch(err => {
      next(err);
    });
});

// router.post("/cafes/:cafeId", (req, res, next) => {
//   Cafes.findById(req.params.cafeId);
//   res.render("cafeDetails.hbs");
// });


module.exports = router;
