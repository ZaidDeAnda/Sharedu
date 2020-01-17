// ===============================================================================================
//    Requirements and init variables
// ===============================================================================================
var express       = require('express'),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    airtable      = require("airtable"),
    flash         = require('connect-flash'),
    passport      = require('passport'),
    localStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    // Import models, before they were in this file, but now it's in another one
    User          = require('./models/user'),
    // To have our data base very cool
    // seedDB        = require('./seed'),
    // Routes
    indexRoutes   = require('./routes/index'),

    app           = express();
// ===============================================================================================
//    Set Up
// ===============================================================================================
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(process.env.SHAREDUDATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(methodOverride("_method"));
// To have our data base very cool
// seedDB.olympiadSeedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy was not fuzzy, was he",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
 });

 // Airtable setup
 airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY
});
var base = airtable.base(process.env.AIRTABLE_BASE);


// ===============================================================================================
//    Routes
// ===============================================================================================
app.use("/", indexRoutes);

// ===============================================================================================
//    Run the server
// ===============================================================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started in port " + process.env.PORT);
});