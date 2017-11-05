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
			var link = $(element).children(".headline").children("a").attr("href");
			
			if(title !=""){
				results.push({
					title:title,
					summary:summary,
					link: link
				});
			}
			
		});
		console.log("line 56: "+results);
		res.render("scraped", { results })
	});
});

// A GET route for getting all saved Articles from the db
app.get("/saved", function(req,res){
	console.log("line 63: "+req.body);
	db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log("line 68: "+dbArticle);
      res.render("saved", { dbArticle});
      //this will be a render to the saved articles page
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

})

//A POST route for saving an article
app.post("/save", function(req,res){
	var savedArticle = req.body;
	console.log(savedArticle);
	db.Article.create(savedArticle).then(function(dbArticle){
		// res.json(dbArticle);
		console.log("line 84: "+dbArticle);
	})
})

// A GET route for Notes for a specific article

app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log("line 99 "+dbArticle);
      res.render("note", { dbArticle} );
      //^^this is not working!!!!
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log(err);
    });
});

//A POST route for adding a Note

app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//A GET route for deleting a comment
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  db.Article.findByIdAndRemove(req.params.id, function(error, removed) {
    // Log any errors 
    if (error) {
      console.log(error);
      res.send(error);
    }
    
    else {
      console.log("line 104: "+removed);
      res.redirect("/saved");
    }
  });
});
//something weird is happening here with asynchronicity where right after I delete the article it is still there, even though it is gone from the db


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
