const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const stripe = require('stripe')('sk_test_51HOsdjKHgAOG6NM0qCkshoDXVotggcniJvQTjnZ9ZdMhu0gxa3iXOJ3IihE9QBP4TzWrulT9sE0LNcf11XbyfE2X00KF5Kf92I');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const Coupons = require("../../models/Coupons");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});



router.post("/getAllCoupons", async (req, res) => {
  var authToken = req.headers.authorization.split("Bearer ")[1];
  var token = jwt.verify(authToken, keys.secretOrKey);  
  const allCoupons = await stripe.coupons.list({
    limit: 30,
  });
  var coupons = await Coupons.find({email:token.email});
  console.log(coupons)
  res.status(200).json({ coupons });
  
});

router.post("/createCoupon", async (req, res) => {
  
  var authToken = req.headers.authorization.split("Bearer ")[1];

  var token = jwt.verify(authToken, keys.secretOrKey);

  var coupon = await stripe.coupons.create({
    currency: req.body.addDoc.currency,
    percent_off: req.body.addDoc.percentOff,
    duration: req.body.addDoc.duration,
    duration_in_months: req.body.addDoc.durationInMonths,
    name: req.body.addDoc.couponName,
  });

  coupon.email = token.email;
  coupon.currency = req.body.addDoc.currency;
  
  const newCoupon = new Coupons(coupon);
    newCoupon.save().then((doc) => {
      // res.status(200).json(doc);
      res.status(200).json({ doc });
    }).catch((e)=>{

    })
 

})

router.post("/deleteCoupon", async (req, res) => {
  const deleted = await stripe.coupons.del(req.body.couponId);
  Coupons.deleteOne({id:deleted.id}).then((response)=>{
    res.status(200).json(deleted);
  }).catch((err)=>{
    console.log(err)
  })
})


// router.post("/updateCoupon", async (req, res) => {
//   const updated = await stripe.coupons.update(req.body.couponId,{
//     currency: req.body.updateDoc.currency,
//     percent_off: req.body.updateDoc.percentOff,
//     duration: req.body.updateDoc.duration,
//     duration_in_months: req.body.updateDoc.durationInMonths,
//     name: req.body.updateDoc.couponName,
//   });
//   Coupons.updateOne({id:updated.id},{
//     currency: req.body.updateDoc.currency,
//     percent_off: req.body.updateDoc.percentOff,
//     duration: req.body.updateDoc.duration,
//     duration_in_months: req.body.upateDoc.durationInMonths,
//     name: req.body.updateDoc.couponName,
//   }).then((response)=>{
//     res.status(200).json(deleted);
//   }).catch((err)=>{
//     console.log(err)
//   })
// })

module.exports = router;
