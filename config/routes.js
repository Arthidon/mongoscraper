// DEPENDENCIES
var axios = require("axios");
var cheerio = require("cheerio");
var moment = require("moment");
var express = require('express');
 

// Require all models
var db = require("../models");

module.exports = function(router) {
    // Route to render the home page
    router.get("/", function(req, res){
        db.Headline.find({}).sort({ date: -1 }).then(function(data) {
            let articleData = {
                articles: data
            };
            res.render("home", articleData);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // Route to render the saved page
    router.get("/saved", function(req, res){
        db.Headline.find({ saved: true }).sort({ date: -1 }).then(function(data) {
            let articleData = {
                articles: data
            };
            res.render("saved", articleData);
        }).catch(function(err) {
            res.json(err);
        });
    });

//Get rout for Richmond Times
router.get("/scrape", function(req, res){
        // Grab the body of the html with axios
        axios.get("https://www.richmond.com/search/?f=html&nfl=ap&q=crime&s=start_time&sd=desc&l=25&nsa=eedition").then(function(response) { 
              
            // Then, we load that into cheerio and save it to $
            var $ = cheerio.load(response.data);
 
                //console Log testing
                // console.log(
                //         $(".tnt-sub-section-crime")
                // // .children('article')
                
                // .children('div')
                // .first()
                // .children()
                // .first()
                // .children()
                // .children()
                // .children()
                // .children("a")
                // .children("img")
                // .attr("alt")
                //         );
                
             
        $('.tnt-sub-section-crime').each(function(i, element) {
                var result = {};

                result.headline = $(this)
                        .children('div')
                        .first()
                        .children()
                        .first()
                        .children()
                        .children()
                        .children()
                        .children("a")
                        .children("img")
                        .attr("alt")
                result.link = $(this)
                        .children('div')
                        .first()
                        .children()
                        .first()
                        .children()
                        .children()
                        .children()
                        .children("a")
                        .attr("href")
                result.imgUrl = $(this)
                        .children('div')
                        .first()
                        .children()
                        .first()
                        .children()
                        .children()
                        .children()
                        .children("a")
                        .children("img")
                        .attr("data-src")
                result.summary = $(this)
                        .children('div')
                        .first()
                        .children()
                        .last()
                        .children("div:nth-child(4)")
                        .text()
                        .trim()
                result.date = $(this)
                        .children('div')
                        .first()
                        .children()
                        .last()
                        .children("div:nth-child(3)")
                        .children()
                        .children("li")
                        .children("time")
                        .attr("datetime")
                result.displayDate = moment(result.date).format('MMMM Do YYYY');
                result.tag = "Crime";

                // console.log(result);
                db.Headline.create(result)
                        .then(function(dbHeadline) {
                            // View the added result in the console
                            console.log(dbHeadline);
                        })
                        .catch(function(err) {
                            // If an error occurred, log it
                            console.log(err);



                        });
             //End Richmond Times scrap           
             });
             res.redirect("/");
        //End Axios Function             
        });

//End Scrap Function
});

    // Route to clear the Headline mongoDB collection
    router.get('/clear', function(req, res) {
        db.Headline.deleteMany({}).then(function() {
            // Redirect to the home page
            res.redirect("/");
        });
    });




//End Export Function
}