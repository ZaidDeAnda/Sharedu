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

// THE LOGIC OF COMPLETE ITS PROFILE
router.post("/complete-profile", middlewareObject.isLoggedIn, function(req, res) {
    var completeUser = req.body.usuario;
    if(completeUser.foto == '') {
        completeUser.foto = [{url: "https://dl.airtable.com/.attachmentThumbnails/5be46d6b0c567d1bc54842f0a37d3a38/4674d134"}];
    } else {
        completeUser.foto = [{url: completeUser.foto}];
    }
    base('Usuarios').create(completeUser, function(err, user) {
        if(err) {
            console.log("OH NO!")
            console.log(err);
        } else {
            var updatedUser = req.user;
            updatedUser.airtableID = user.getId();
            // console.log(updatedUser);
            User.findByIdAndUpdate(req.user._id, updatedUser, function(err, foundUser) {
                // console.log(foundUser);
                res.redirect("/profile");
            });
        }
    });
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