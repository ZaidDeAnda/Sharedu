var express          = require('express'),
    Olimpiada        = require('../models/olimpiada'),
    router           = express.Router(),
    middlewareObject = require('../middleware');


// INDEX ROUTE
router.get("/", function(req, res) {
    Olimpiada.find({}, function(err, allOlympiads) {
        if(err) {
            console.log("OH NO!");
            console.log(err);
        } else {
            res.render("olimpiadas/index", {olimpiadas:allOlympiads});
        }
    })
});

// NEW ROUTE
router.get("/new", middlewareObject.isLoggedIn, middlewareObject.isCommunity, function(req, res) {
    res.render("olimpiadas/new");
});

// CREATE ROUTE
router.post("/new", middlewareObject.isLoggedIn, middlewareObject.isCommunity, function(req, res) {
    var newOlympiad = req.body;
    newOlympiad.encargado = {
        id: req.user._id,
        username: req.user.username
    };
    newOlympiad.requisitos = newOlympiad.requisitos.split("|");
    if(newOlympiad.open == "Sí") {
        newOlympiad.isOpen = true;
    } else {
        newOlympiad.isOpen = false;
    }
    delete newOlympiad.open;
    // console.log(newOlympiad);
    Olimpiada.create(newOlympiad, function(err, createdOlympiad) {
        if(err) {
            return res.send(err);
        }
        res.redirect("/olimpiadas/" + createdOlympiad._id);
    });
});


// SHOW ROUTE
router.get("/:olympic_id", function(req, res) {
    Olimpiada.findById(req.params.olympic_id, function(err, foundOlympiad) {
        if(err) {
            console.log("Eso no etziste we");
            console.log(err);
        } else {
            res.render("olimpiadas/show", { olimpiada:foundOlympiad });
        }
    });
});

// EDIT ROUTE
router.get("/:olympic_id/edit", middlewareObject.checkOwner, function(req, res) {
    Olimpiada.findById(req.params.olympic_id, function(err, foundOlympiad) {
        if(err) {
            console.log("OH NO!");
            console.log(err);
        } else {
            var requi = "";
            foundOlympiad.requisitos.forEach(requisito => {
                requi += requisito + "|";           
            });
            requi = requi.substring(0, requi.length - 1);
            res.render("olimpiadas/edit", { olimpiada:foundOlympiad, requisitos:requi});
        }
    });
});

// UPDATE ROUTE
router.put("/:olympic_id/edit", middlewareObject.checkOwner, function(req, res) {
    var newOlympiad = req.body;
    newOlympiad.encargado = {
        id: req.user._id,
        username: req.user.username
    };
    newOlympiad.requisitos = req.body.requisitos.split("|");
    if(newOlympiad.open == "Sí") {
        newOlympiad.isOpen = true;
    } else {
        newOlympiad.isOpen = false;
    }
    delete newOlympiad.open;
    // console.log(newOlympiad);
    Olimpiada.findByIdAndUpdate(req.params.olympic_id, newOlympiad, function(err, updatedOlympiad) {
        if(err) {
            console.log("NO SE PUDO BRO");
            return res.send(err);
        }
        res.redirect("/olimpiadas/" + req.params.olympic_id);
    });
});

// DELETE ROUTE
router.delete("/:olympic_id", middlewareObject.checkOwner, function(req, res) {
    Olimpiada.findByIdAndDelete(req.params.olympic_id, function(err) {
        if(err) {
            return res.send(err);
        }
        res.redirect("/olimpiadas");
    });
})

// Exporting stuff
module.exports = router;