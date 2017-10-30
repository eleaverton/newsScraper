var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Require all models
// var db = require("./models");

var PORT = process.env.port || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/newsscraper", {
//   useMongoClient: true
// });

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
			results.push({
				title:title,
				summary:summary,
				link:link
			});
		});
		console.log(results);
	});
});

// A GET route for getting all saved Articles from the db

// A GET route for Notes for a specific article

//A POST route for adding a Note

//A GET route for deleting a comment



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
