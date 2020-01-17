var express   = require('express'),
    router    = express.Router(),
    passport  = require('passport'),
    airtable  = require("airtable"),
    base      = airtable.base(process.env.AIRTABLE_BASE),
    middlewareObject = require('../middleware');
    User      = require('../models/user');

// INDEX ROUTE
router.get("/", function(req, res) {
    var convocatorias = [];
    base('Convocatorias').select({
        maxRecords: 4,
        view: "Grid view"
    }).eachPage(function page(listaConvocatorias, fetchNextPage) {
        listaConvocatorias.forEach( convocatoria => {
            convocatorias.push(convocatoria);
        });
        fetchNextPage();
    }, function done(err) {
        if(err) {
            console.log(err);
        } else {
            // console.log(convocatorias);
            res.render("index", {convocatorias:convocatorias});
        }
    });
});

// PROFILE ROUTE
router.get("/profile", middlewareObject.isLoggedIn, middlewareObject.isOnAirTable, function(req, res) {
    res.send("This is the profile page");
});

// COMPLETE PROFILE ROUTE
router.get("/complete-profile", middlewareObject.isLoggedIn, function(req, res) {
    res.render("complete_profile");
});

// REGISTER ROUTES
router.get("/register", function(req, res) {
    res.render("register");
});

// REGISTER USER SHOW FORM
router.get("/register-user", function(req, res) {
    res.render("register_user");
});

// HANDLE LOGIC OF REGISTER USER
router.post("/register-user", function(req, res) {
    if(req.body.password != req.body.password2) {
        req.flash("error", "Las contraseñas no coinciden");
        return res.redirect("back");
    }
    var newUser = new User({username: req.body.username, isCommunity: false});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/register-user")
        } else {
            passport.authenticate("Local")(req, res, function() {
            res.redirect("/login");
            });
        }
    });

});

// REGISTER COMMUNITY SHOW FORM
router.get("/register-community", function(req, res) {
    res.render("register_community");
});

// HANDLE LOGIC OF REGISTER USER
router.post("/register-community", function(req, res) {
    if(req.body.password != req.body.password2) {
        req.flash("error", "Las contraseñas no coinciden");
        return res.redirect("back");
    }
    var newUser = new User({username: req.body.username, isCommunity: true});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back")
        } else {
            passport.authenticate("Local")(req, res, function() {
            res.redirect("/login");
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
    req.flash("success", "Has salido correctamente");
    res.redirect("/");
});

module.exports = router;