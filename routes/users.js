const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

var User = require("../models/User");

// The request for the route /login will send back the register.handlebars page with the title Register
router.get("/login", (req, res) => res.render('login', { title: "Login" }))

// The request for the route /register will send back the register.handlebars page with the title Register
router.get("/register", (req, res) => res.render('register', { title: "Register" }))

// Register Handle
router.post("/register", (req, res) => {
    console.log(req.body)
    const { firstname, lastname, email, password, password2 } = req.body

    // array for errors
    let errors = [];

    // Check required fields
    if (!firstname || !lastname || !email || !password || !password2) {
        console.log("Please fill in all fields")
        errors.push({ msg: "Please fill in all fields" })
    }

    // Check if password equals confirmed password
    if (password != password2) {
        console.log("Passwords do not match")
        errors.push({ msg: "Passwords do not match" })
    }

    if (password.length < 6) {
        console.log("Password should be at least 6 characters")
        errors.push({ msg: "Password should be at least 6 characters" })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            firstname,
            lastname,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                // User already exists
                if (user) {
                    console.log('Email is already registered');
                    errors.push({ msg: "Email is already registered" })
                    res.render('register', {
                        errors,
                        firstname,
                        lastname,
                        email,
                        password,
                        password2
                    })

                } else {
                    // Package data into newUser object
                    const newUser = new User({
                        first_name: firstname,
                        last_name: lastname,
                        email,
                        password: password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            // Set password to hash
                            newUser.password = hash

                            // Save user to collection
                            console.log(newUser)
                            newUser.save()
                                // If user is saved, we want to redirect to login page with success message
                                .then(user => {
                                    console.log("YOU ARE GOOD")
                                    req.flash("success_msg", "You are no registered and can now log in")
                                    res.redirect('login')
                                })
                                // If not saved, we want to show error
                                .catch(err => console.log(err))
                        }))
                }
            })
    }

});

// Login Handle
router.post("/login", (req, res, next) => {
    console.log("\nTHIS IS THE LOGIN REQUEST BODY")
    console.log(req.body)
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)

})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login")
})

module.exports = router;