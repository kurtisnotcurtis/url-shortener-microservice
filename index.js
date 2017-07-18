const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const urlDB = process.env.MONGOLAB_URI; // DB Connection URL provided in env var

const port = process.env.PORT || 3000;
var app = express();

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({extended: true}) );

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
    res.status(400);
    response.error = "Invalid URL: " + req.params.url + " is not a valid URL.";
  }
  res.json(response);
});

app.listen(port);  

/* Use connect method to connect to the Server
  MongoClient.connect(urlDB, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', urlDB);

    // do some work here with the database.

    //Close connection
    db.close();
  }
}); */