const express = require("express");
const path = require("path");

const pug = require("pug");
const homepage = pug.compileFile( path.join(__dirname, "views", "index.pug") );

const port = process.env.PORT || 3000;
var app = express();

app.set("view engine", "pug");

app.get("/", function (req, res) { // Serve homepage (static view)
  res.render(path.join(__dirname, "views", "index"));
});

app.get("/:url", function (req, res) { // Handle passed url param
  
  res.json();
});

app.listen(port);