// DEPENDENCIES
var axios = require("axios");
var cheerio = require("cheerio");
var moment = require("moment");

// Require all models
var db = require("../models");

module.exports = function(router) {

    // Route to render the home page
    router.get("/", function(req, res){
        db.Headline.find({}).sort({ date: -1 }).then(function(data) {
            if (data.length === 0) {
                res.render("empty");
            } else {
                let articleData = {
                    articles: data
                };
                res.render("home", articleData);
            }
        }).catch(function(err) {
            res.json(err);
        });
    });

    // Route to render the saved page
    router.get("/saved", function (req, res) {
        db.Headline.find({ saved: true }).sort({ date: -1 }).then(function (data) {
            let articleData = {
                articles: data
            };
            res.render("saved", articleData);
        }).catch(function (err) {
            res.json(err);
        });
    });

   //Get rout for Richmond Times
router.get("/scrape", function(req, res){
    // Grab the body of the html with axios
    axios.get("https://www.richmond.com/search/?f=html&nfl=ap&q=crime&s=start_time&sd=desc&l=25&nsa=eedition").then(function(response) { 
          
        // Then, we load that into cheerio and save it to $
        var $ = cheerio.load(response.data);
         
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
                    .attr("data-srcset")
                    

            console.log(result.imgUrl);

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

                console.log(result);

                //Create Collection
                db.Headline.create(result)
                        .then(function(dbHeadline) {
                            // Created collection log
                            // console.log(dbHeadline);
                        })
                        .catch(function(err) {
                            //If Error Log
                            console.log(err);



                        });
            // Richmond Times Function            
            });
            res.redirect("/");
            //End Axios
        })
    //End Scrape Function
    });

    // Route to clear the Headline and Note mongoDB collection
    router.get('/clear', function(req, res) {
        db.Headline.deleteMany({}).then(function() {
            db.Note.deleteMany({}).then(function() {
                res.redirect("/");
            });
        });
    });

    // Notes for Headline ID
    router.get('/notes/:id', function(req, res) {
        db.Note.find({ _headlineId: req.params.id }).then(function(data) {
            res.json(data);
        })
    });

    // Delete Notes by ID
    router.get('/deletenote/:id', function(req, res) {
        db.Note.findByIdAndDelete({ _id: req.params.id }).then(function(data) {
            res.json(data);
        })
    });

    // Route not found, render 404 handlebars layout
    router.get('*', function(req, res) {
        res.render("404");
    });

    // Route to save/unsave an article
    router.post('/save/:id', function(req, res) {
        db.Headline.findOneAndUpdate({ _id: req.params.id }, 
            {$set: {saved: req.body.saved}},
            function (err, doc) {
                if (err) {
                    console.log("Update Article Failed");
                } else {
                    console.log("Update Article Succesful");
                }
            });
    });

    // Route to add new note
    router.post('/addnote', function(req, res) {
        db.Note.create(req.body)
            .then(function(dbNote) {
                // View the added result in the console
                res.json(dbNote);
                console.log(dbNote);
            })
            .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
            });
    });
    //End Export Function
}