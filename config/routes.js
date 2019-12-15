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

//Get rout for Richmond Times
router.get("/scrape", function(req, res){
        // Grab the body of the html with axios
        axios.get("https://www.richmond.com/search/?f=html&nfl=ap&q=crime&s=start_time&sd=desc&l=25&nsa=eedition").then(function(response) { 
              
            // Then, we load that into cheerio and save it to $
            var $ = cheerio.load(response.data);
 
                //console Log testing
                console.log(
                        $("article, .tnt-section-news")
                // .children('article')
                
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

                        );
                
//      if  ( $("article").hasClass('tnt-section-news') == true){ 
             
        $('article').each(function(i, element) {
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

                console.log(result);
                // db.Headline.create(result)
                        // .then(function(dbHeadline) {
                        //     // View the added result in the console
                        //     console.log(dbHeadline);
                        // })
                        // .catch(function(err) {
                        //     // If an error occurred, log it
                        //     console.log(err);
                        // });
            }) ;


        // }
});

});
}