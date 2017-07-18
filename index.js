const express = require("express");
const path = require("path");

const mongodb = require('mongodb'); // Let's import the mongodb native drivers
const MongoClient = mongodb.MongoClient; // We need to work with "MongoClient" interface in order to connect to a mongodb server
const urlDB = process.env.MONGOLAB_URI; // Connection URL. This is where your mongodb server is running.

const port = process.env.PORT || 3000;
var app = express();

app.set("view engine", "pug");

app.get("/", function (req, res) { // Serve homepage (static view)
  var locals = {
    client_ip: req.ip
  };
  
  res.render(path.join(__dirname, "views", "index"), locals);
  
  if (req.query) {
      // Forward to app.get("/:url")
  }
});

app.get("/:url", function (req, res) { // Handle passed url param
  const regex = /(http:\/\/)*(https:\/\/)*(www\.)\w+(\.\w{2,3})/gm;
  var response = {};
  
  if (regex.test(req.params.url)) { // param is a valid URL (validation pass)
      response.url = req.params.url;
  } else {
      response.err = "Invalid URL: " + req.params.url ;
  }
  res.json();
});

app.listen(port);  

// Use connect method to connect to the Server
  MongoClient.connect(urlDB, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', urlDB);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});