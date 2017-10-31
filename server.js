var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = process.env.port || 3000;
 
// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
//Set handlebars as view engine
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsscraper", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the nyt website
app.get("/", function(req,res){
	console.log("Getting NYT World Articles");
	var url = "https://www.nytimes.com/section/world";
	request(url, function(error, response, html){
		var $ = cheerio.load(html);
		var results = [];
		$("div.story-body").each(function(i, element){
			var title = $(element).children(".headline").text();
			var summary = $(element).children(".summary").text();
			var link = $(element).children(".headline").attr("href");
			if(title !=""){
				results.push({
					title:title,
					summary:summary,
					link:link
				});
			}
			
		});
		console.log(results);
		res.render("scraped", { results })
	});
});

// A GET route for getting all saved Articles from the db
app.get("/saved", function(req,res){
	db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

})

//A POST route for saving an article
app.post("/save", function(req,res){
	db.Article.create
})

// A GET route for Notes for a specific article

//A POST route for adding a Note

//A GET route for deleting a comment



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
