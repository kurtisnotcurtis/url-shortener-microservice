const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const urlDB = process.env.MONGOLAB_URI; // DB Connection URL provided in env var (/.env)

const port = process.env.PORT || 3000;
var app = express();
var mongoDB;

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({extended: true}) );

app.get("/", function (req, res) { // Serve homepage (static view)
  var locals = { client_ip: req.ip };
  res.render(path.join(__dirname, "views", "index"), locals);
});

app.post("/:url", function (req, res) { // Handle URLs inputted via the form
  console.log("POST request to /:url with parameter:", req.query.url);
  // First check if the URL is a valid URL
  if ( validateURL(req.query.url) ) {
    console.log("Generating shortened link...");
    res.json( JSON.stringify( generateURL(req) ) ); // Provide object with source and redirect URLs as JSON
  } else { // Provide error details as JSON
    res.status(400);
    var response = {};
    response.error = "Invalid URL: " + req.query.url + " is not a valid URL.";
    res.json(response);
  }
});

app.get( "/:url", function (req, res) { // Handles URLs sent as parameters for either link generation or redirection
  console.log("GET request to /:url with parameter:", req.params.url);
  // First check if the URL is a valid URL
  if ( validateURL(req.params.url) ) {
    console.log("Generating shortened link...");
    return JSON.stringify( generateURL(req) ); // Provide object with source and redirect URLs as JSON
  } else {
    const regex = /\d{5}/;
    if ( regex.test(req.params.url) ) {
      console.log("User is attempting to use shortened URL...");
      
      var doc = mongoDB.collection("urls").findOne({
        redir_url: req.params.url
      });
      mongoDB.close();
      
      if (doc) {
        console.log("Redirecting to", doc.src_url, "...");
        res.redirect(doc.src_url);
      } else {
        console.log("Redirection failed; database record with redirect_url:", req.params.url, "not found.");
        res.status(404).end();
      }
    } else {
      // Invalid request
      res.status(400)
      res.json({error: req.params.url + " was not found."});
    }
  }
});

function validateURL (url) { // Validates user-inputted URL
  const regex = /(www\.)\w+(\.\w{2,3})/gm;
  console.log("Validating URL:", url);
  if ( regex.test(url) ) {
    console.log("URL is valid:", url);
    return true;
  } else {
    console.log("URL is invalid:", url);
    return false;
  }
}

function generateURL (req) {
  var hi;
  
  mongoDB.collection("urls").find().toArray(function (err, documents) {
    if (err) console.log(err);
    
    hi = documents.reduce(function (acc, curdoc) {
      return acc < curdoc.redir_url ? curdoc.redir_url : acc;
    }, 0);
    
    console.log("Current highest link number is", hi, ", new link ID is", ++hi
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                ;
    
    var redirectObj = {
    src_url: req.params.url,
    redir_url: ++hi
    };

    mongoDB.collection("urls").save(redirectObj, function (err, result) {
      if (err) return console.log(err);
    });
  
    return redirectObj;
  });
}

// Use connect method to connect to the Server
MongoClient.connect(urlDB, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('MongoDB Connection established!');
    mongoDB = db;
    app.listen(port);
  }
});