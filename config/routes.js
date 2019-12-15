// DEPENDENCIES
var axios = require("axios");
var cheerio = require("cheerio");
var moment = require("moment");

// Require all models
// var db = require("../models");

module.exports = function(router) {
    // Route to render the home page
    router.get("/", function(req, res){

            res.render("home");
        
    });

    // Route to render the saved page
    router.get("/saved", function(req, res){

            res.render("saved");
    });

}