var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObject.isOnAirTable = function(req, res, next) {
    if(req.user.airtableID != "") {
        return next();
    }
    req.flash("error", "¡ALGO SALIÓ MAL! Primero necesitamos que completes tu perfil");
    return res.redirect("/complete-profile");
};

middlewareObject.isCommunity = function(req, res, next) {
    if(req.user.isCommunity) {
        return next();
    }
    // req.flash("error", "You need to be a community to do that");
    res.redirect("back");
}

// middlewareObject.checkOwner = function(req, res, next) {
//     if(req.isAuthenticated()) {
//         Olimpiada.findById(req.params.olympic_id, function(err, foundOlympiad) {
//             if(err) {
//                 res.send(err);
//             } else {
//                 if(foundOlympiad.encargado.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     // req.flash("error", "You do not have permission to do that");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         // req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
// }

module.exports = middlewareObject;