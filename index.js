const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;

var app = express();

app.get("/", function (req, res) { // Serve homepage
  
});

app.get("/:url", function (req, res) { // Handle passed url param
  
});

app.listen(port);