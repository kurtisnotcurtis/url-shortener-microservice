const express = require("express");
const path = require("path");
const pug = require("pug");
const homepage = pug.compileFile( path.join(__dirname, "public", "index.pug") );
const port = process.env.PORT || 3000;
var app = express();

app.get("/", function (req, res) { // Serve homepage (static view)
  var fileName = path.join(__dirname, "views", "index.html");
  res.sendFile(fileName, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log("Serving view:", fileName);
    }
  });
});

app.get("/:url", function (req, res) { // Handle passed url param
  
  res.json();
});

app.listen(port);