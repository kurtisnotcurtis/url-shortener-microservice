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
  var locals = {
    client_ip: req.ip
  };
  res.render(path.join(__dirname, "views", "index"), locals);
});

app.post("/:url", function (req, res) { // Handle URLs inputted via the form
  console.log("POST request to /:url with parameter:", req.query.url);
  // First check if the URL is a valid URL
  if ( validateURL(req.query.url) ) {
    console.log("URL is a valid one - generating shortened link...");
    return JSON.stringify( generateURL(req) ); // Provide object with source and redirect URLs as JSON
  } else {
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
    console.log("URL is a valid one - generating shortened link...");
    return JSON.stringify( generateURL(req) ); // Provide object with source and redirect URLs as JSON
  } else {
    // Could be a user attempting to use shortened URL...
    console.log("Redirecting to", req.params.url, "...");
    res.redirect(req.params.url);
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
  var redirectObj = {
    src_url: req.params.url,
    redir_url: null
  };

  mongoDB.collection("urls").save(redirectObj, function (err, result) {
        if (err) return console.log(err);
      });
  
  return redirectObj;
}

// Use connect method to connect to the Server
MongoClient.connect(urlDB, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('MongoDB Connection established!');
    mongoDB = db;
    app.listen(port);
    
  //Close connection
  //db.close();
}
});