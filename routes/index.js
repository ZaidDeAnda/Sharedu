var express   = require('express'),
    router    = express.Router(),
    passport  = require('passport'),
    Olimpiada = require('../models/olimpiada'),
    User      = require('../models/user');

// INDEX ROUTE
router.get("/", function(req, res) {
    Olimpiada.find({}, function(err, allOlympiads) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {olimpiadas:allOlympiads});
        }
    })
});

// REGISTER ROUTE
router.get("/register", function(req, res) {
    res.render("register");
});

// HANDLE LOGIC OF REGISTER
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    newUser.isCommunity = false;
    if(req.body.isCommunity) {
        newUser.isCommunity = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log("Usuario no creado");
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("Local")(req, res, function() {
            res.redirect("/");
            });
        }
    });
});

// LOGIN ROUTE
router.get("/login", function(req, res) {
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;