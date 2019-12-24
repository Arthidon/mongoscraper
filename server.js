// DEPENDENCIES
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');

// Set up port to be either the host's designated port or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express app
var app = express();

// Setup an Express Router
var router = express.Router();

// Pass routes file into our router
require("./config/routes")(router);

// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Have every request go through our router middleware
app.use(router);

// If deployed, use the deployed database, otherwise use the local database
var db = process.env.MONGODB_URI || "mongodb://localhost/headlines";

// Connect mongoose to our database
mongoose.connect(db, { 
    useNewUrlParser: true 
}, function(error){
    if (error) {
        console.log(error);
    } else {
        console.log("mongoose connection successful");
    }
});

// Listen on the port
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});